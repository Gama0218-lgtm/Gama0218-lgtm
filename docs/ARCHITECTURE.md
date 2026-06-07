# LitCentral v13 + JAMNet — C4 Architecture

**System:** LitCentral v13 (manuscript audit & revision) + JAMNet · TruthEngine360 (stakeholder intelligence)
**Companion:** [`architecture.html`](./architecture.html)
**Status:** Implementation in progress
**Last reviewed:** 2026-05-27

> Source-of-truth architecture doc. Use this file for reviews, ADRs, and
> change proposals. Use `architecture.html` for walkthroughs, internal docs
> portals, or sharing.

---

## Operational targets

| Target          | Value     | Notes                                                    |
| --------------- | --------- | -------------------------------------------------------- |
| Availability    | 99.95%    | Web + API, excluding scheduled maintenance windows.      |
| Latency (P95)   | < 300 ms  | API surface, measured at the edge.                       |
| Scale           | Auto      | Horizontal — stateless API + workers.                    |
| Security        | MFA       | Required for privileged + tenant-admin roles.            |
| Data residency  | Per tenant| Configurable on the tenant record.                       |
| Audit retention | 18 months | Audit + access logs in append-only storage.              |

---

## C4 Level 1 — System Context

**System under design:** **LitCentral + JAMNet**, a multi-tenant SaaS that
runs manuscript audits (Gate Zero → Gate One → Gate Two) and the JAMNet
TruthEngine360 stakeholder-intelligence platform on the same identity and
data plane.

### Actors

| Actor                 | Channel        | Why they touch the system                                   |
| --------------------- | -------------- | ----------------------------------------------------------- |
| Field operator        | Web (JAMNet)   | Runs Social Listening Grid, files field-ops dispatches.     |
| Stakeholder researcher| Web (JAMNet)   | Maintains CRM, runs SPSS / cohort vectors, exports digests. |
| Manuscript author     | Web (LitCentral)| Submits manuscripts, runs gates, accepts revision tasks.   |
| Tenant admin          | Web (Settings) | Configures auth, retention, connected social platforms.    |
| Reviewer (blinded)    | Web (Gate Two) | Reviews task-driven revisions, signs off acceptance.       |

### External systems

| External system            | Direction | Purpose                                       |
| -------------------------- | --------- | --------------------------------------------- |
| X / Twitter API            | inbound   | Social listening: posts, search, metrics.     |
| Reddit OAuth API           | inbound   | Listening: subreddit + submission streams.    |
| YouTube Data API           | inbound   | Listening: search, comments, video metadata.  |
| TikTok Open API            | inbound   | Listening: hashtag + video query.             |
| Meta Graph (FB / IG)       | inbound   | Listening: business mentions + hashtags.      |
| LinkedIn API               | inbound   | Listening: share stream, company mentions.    |
| News / RSS aggregators     | inbound   | Listening: press wires, RSS, Google News.     |
| Crossref / OpenLibrary / Google Books / LoC / Semantic Scholar / TMDB | inbound | Manuscript corpus enrichment + citation. |
| Identity Provider (OIDC)   | outbound  | SSO + tenant federation.                      |
| Email / SMS delivery       | outbound  | Notifications + 2FA codes.                    |
| Object storage (S3-compat) | both      | Manuscript versions, exports, audit packs.    |

### Trust boundaries

```
[Public internet]
   │
   ▼
[Edge: WAF + ALB + TLS] ──► [Web App] ──► [API: stateless service]
                                              │
                ┌─────────────────────────────┼─────────────────────────────┐
                ▼                             ▼                             ▼
        [Auth (OIDC)]              [Domain services]              [Workers (async)]
                                              │                             │
                                              ▼                             ▼
                                       [Postgres / Aurora]           [Object storage]
                                              │
                                              ▼
                                      [Audit + event log]
```

Tenant isolation is enforced at the API layer (row-level scoping by
`tenantId` from the JWT) **and** at the database layer (RLS policies).

---

## C4 Level 2 — Container View

| Container             | Tech                              | Responsibility                                                                 | Scaling           |
| --------------------- | --------------------------------- | ------------------------------------------------------------------------------ | ----------------- |
| **Web / Mobile**      | React + Vite + Tailwind           | LitCentral dashboard + JAMNet `/jams` route. Renders gates, CRM, listening UI. | CDN static        |
| **Edge**              | CloudFront / WAF + ALB            | TLS termination, WAF rules, request shaping, bot mitigation.                   | Managed           |
| **API (stateless)**   | Node / TypeScript                 | Domain services for manuscripts, audits, listening, CRM, reports.              | Horizontal (HPA)  |
| **Auth**              | OIDC provider + JWT               | SSO, tenant resolution, role + privilege claims, MFA gating.                   | Managed           |
| **Workers**           | Node + cron / queue               | Nightly digests, ingestion adapters, audit recomputation.                      | Horizontal        |
| **Reports**           | Markdown / CSV / PDF builders     | Listening digests, audit reports, compliance evidence packs.                   | Horizontal        |
| **DB**                | Aurora / Postgres                 | Manuscripts, gates, listening cache, CRM, audit log.                           | Aurora cluster    |
| **S3**                | Object storage                    | Frozen manuscript versions, generated reports, asset uploads.                  | Managed           |
| **Search (optional)** | OpenSearch / pgvector             | Full-text + semantic search across manuscripts and mentions.                   | Cluster           |

### Deployment shape

```
Region (multi-AZ)
├── CDN (static web bundle)
├── Edge → WAF → ALB → API service (Fargate / k8s)
├── Workers (Fargate / k8s, queue-backed)
├── Aurora Postgres (multi-AZ, read replicas)
└── S3 buckets per environment + per tenant prefix
```

---

## C4 Level 3 — Component Interactions

### Request pipeline (synchronous)

```
[Client] ─► [Auth MW] ─► [Domain Svc] ─► [Repository] ─► [DB]
                │              │
                ▼              ▼
            [Policy]    [Audit + Events]
```

| Component             | Responsibility                                                                |
| --------------------- | ----------------------------------------------------------------------------- |
| **Auth MW**           | Verifies JWT, resolves tenant, injects request context.                       |
| **Policy**            | Evaluates RBAC / ABAC decisions per route + resource.                         |
| **Domain Svc**        | Business logic for manuscripts, gates, listening, CRM, reports.               |
| **Repository**        | Tenant-scoped reads/writes against Postgres with RLS enforced server-side.    |
| **Audit + Events**    | Append-only audit log, fans out domain events to workers + listeners.         |

### Listening pipeline (asynchronous)

```
[Adapter Workers] ─► [Listening Engine] ─► [Rules Engine] ─► [Alerts + Digest]
   │                       │                                      │
   ▼                       ▼                                      ▼
[External APIs]      [Mentions cache]                       [Notifications + Storage]
```

The listening engine is implemented today in
[`src/lib/socialListening.js`](../src/lib/socialListening.js). See `SKILL.md`
at the repo root for the engine spec and adapter contract.

| Component         | Implementation                                                              |
| ----------------- | --------------------------------------------------------------------------- |
| Adapter workers   | Per-platform poll / stream — X, Reddit, YouTube, TikTok, Meta, LinkedIn, RSS. |
| Listening Engine  | Unified `fetchMentions → aggregateMetrics`.                                 |
| Rules Engine      | `evaluateRules` against rolling EMA baseline.                               |
| Alerts + Digest   | `buildDigestMarkdown` / `buildDigestCSV` → exporters + notifications.       |

### Manuscript audit pipeline

```
[Author submits] ─► [Gate Zero: normalize] ─► [ManuscriptVersion (frozen, SHA-256)]
                                                       │
                                                       ▼
                                       [Gate One: evidence audit (Ω score)]
                                                       │
                                                       ▼
                                     [Gate Two: revision + blinded review]
```

---

## API contracts (template)

Every domain endpoint follows the same shape so SDKs and audit hooks stay
predictable.

```
POST /v1/{resource}                Create
GET  /v1/{resource}                List      (paginated, filterable)
GET  /v1/{resource}/{id}           Read
PATCH /v1/{resource}/{id}          Update    (RFC 7396 merge patch)
DELETE /v1/{resource}/{id}         Archive   (soft-delete; audit recorded)

Headers:
  Authorization: Bearer <JWT>
  X-Tenant-Id:   <uuid>        (must match JWT claim)
  Idempotency-Key: <uuid>      (required for POST + PATCH)

Errors:
  { "code": "forbidden", "message": "...", "traceId": "<uuid>" }
```

## Event schema (template)

```json
{
  "id": "uuid-v7",
  "type": "listening.alert.fired",
  "tenantId": "uuid",
  "occurredAt": "2026-05-27T18:42:11Z",
  "actor": { "kind": "system" | "user", "id": "..." },
  "subject": { "kind": "alert", "id": "uuid" },
  "data": { "...": "rule-specific payload" },
  "version": 1
}
```

Events fan out from the API on the synchronous path and from workers on the
async path. Consumers are idempotent on `event.id`.

---

## Reporting and metrics

### Operational reporting modules

| Module                 | Focus                                                  | Primary outputs                    |
| ---------------------- | ------------------------------------------------------ | ---------------------------------- |
| Operational dashboard  | Latency, errors, throughput, saturation                | Alerts, health views               |
| Business reporting     | Usage, billing, conversion, retention                  | Scheduled reports, exports         |
| Security reporting     | Auth events, anomalies, privileged access              | Security dashboards                |
| Compliance reporting   | Retention, evidence, export history                    | Audit evidence packs               |
| **Listening digests**  | Volume, sentiment, reach, alerts (per-tenant)          | Markdown + CSV digests, alerts     |
| **Audit reports**      | Ω score, evidence completeness, gate transitions       | Per-manuscript audit PDFs          |

### Metrics catalog

| Metric                            | Source         | SLO / Target          |
| --------------------------------- | -------------- | --------------------- |
| `api_request_duration_ms`         | API            | P95 < 300 ms          |
| `api_5xx_rate`                    | API            | < 0.1% rolling 5m     |
| `worker_lag_seconds`              | Workers        | < 60 s P95            |
| `listening_ingest_lag_seconds`    | Listening      | < 5 m P95             |
| `listening_alerts_fired_per_tenant`| Listening     | n/a (info)            |
| `audit_omega_delta`               | Audit          | ≥ +0.3 per Gate Two   |
| `auth_failed_logins_5m`           | Auth           | alert on > 50         |
| `db_replication_lag_seconds`      | DB             | < 5 s                 |

### Dashboards

- **Ops** — RED + USE dashboards for API, workers, edge.
- **Listening** — per-tenant volume, sentiment trend, top platforms, fired alerts.
- **Audit** — Ω score distribution, gate pass-rates, evidence completeness.
- **Security** — auth failures, MFA usage, privileged access trail.

---

## Implementation starter — Structurizr DSL

```dsl
workspace "LitCentral + JAMNet" "C4 architecture for the LitCentral manuscript audit and JAMNet stakeholder intelligence platform" {
  model {
    user      = person "Field Operator"           "Runs JAMNet listening + field ops"
    researcher= person "Stakeholder Researcher"   "Maintains CRM + cohort vectors"
    author    = person "Manuscript Author"        "Submits manuscripts and runs gates"
    admin     = person "Tenant Admin"             "Configures tenants and reviews reports"

    system = softwareSystem "LitCentral + JAMNet" "Multi-tenant SaaS — audits + stakeholder intel" {
      web    = container "Web App"        "React + Vite + Tailwind"           "Web"
      api    = container "API"            "Stateless service"                  "Node/TS"
      auth   = container "Auth"           "OIDC provider"                      "Managed"
      worker = container "Workers"        "Adapters + scheduled jobs"          "Node/TS"
      report = container "Reports"        "Markdown / CSV / PDF builders"      "Node/TS"
      db     = container "Database"       "Aurora Postgres + RLS"              "Postgres"
      store  = container "Object Storage" "Frozen manuscripts + exports"       "S3"
    }

    x      = softwareSystem "X / Twitter"  "Social platform"
    reddit = softwareSystem "Reddit"       "Social platform"
    youtube= softwareSystem "YouTube"      "Social platform"
    tiktok = softwareSystem "TikTok"       "Social platform"
    meta   = softwareSystem "Meta Graph"   "Facebook + Instagram"
    li     = softwareSystem "LinkedIn"     "Social platform"
    news   = softwareSystem "News / RSS"   "Press + RSS feeds"
    corpus = softwareSystem "Academic APIs" "Crossref, OpenLibrary, Google Books, LoC, Semantic Scholar, TMDB"

    user       -> web    "Uses (JAMNet)"
    researcher -> web    "Uses (CRM + listening)"
    author     -> web    "Uses (LitCentral)"
    admin      -> web    "Administers"

    web   -> api  "JSON/HTTPS"
    web   -> auth "OIDC"
    api   -> db   "Reads/writes (RLS)"
    api   -> store "Writes exports"
    api   -> worker "Enqueues jobs"
    worker -> db   "Reads/writes (RLS)"
    worker -> store "Writes exports"
    worker -> report "Renders digests"

    worker -> x      "Polls posts"
    worker -> reddit "Polls subreddits"
    worker -> youtube "Polls search + comments"
    worker -> tiktok "Polls hashtags"
    worker -> meta   "Polls business mentions"
    worker -> li     "Polls share stream"
    worker -> news   "Polls RSS / wires"
    worker -> corpus "Enriches manuscripts"
  }

  views {
    systemContext system "SystemContext" { include *; autoLayout lr }
    container     system "Containers"    { include *; autoLayout lr }
  }
}
```

## Implementation starter — Auth middleware

```js
export async function authorize(request, response, next) {
  const token   = extractBearerToken(request.headers.authorization);
  const claims  = await verifyJwt(token, jwksClient);
  const tenantId= resolveTenant(request, claims);

  const decision = await policyEngine.evaluate({
    subject:  { userId: claims.sub, roles: claims.roles || [], tenantId },
    action:   request.method,
    resource: request.route.path,
  });

  if (!decision.allow) return response.status(403).json({ code: "forbidden" });

  request.context = { claims, tenantId };
  next();
}
```

## Implementation starter — Nightly listening digest

```js
import { fetchMentions, aggregateMetrics, evaluateRules, buildDigestMarkdown } from "../src/lib/socialListening.js";

export async function nightlyDigest({ tenantId, uploader }) {
  const since   = Date.now() - 24 * 60 * 60_000;
  const posts   = await fetchMentions({ since });
  const metrics = aggregateMetrics(posts);
  const alerts  = evaluateRules({ metrics, baseline: null });
  const md      = buildDigestMarkdown({ window: "24h", metrics, alerts, posts });

  await uploader.put(`tenants/${tenantId}/digests/${new Date().toISOString()}.md`, md);
  if (alerts.length) await notify(tenantId, alerts);
  return { tenantId, mentions: metrics.total, alerts: alerts.length };
}
```

---

## Standard sections checklist

This doc covers the standard C4 review surface:

- [x] System context, actors, channels, trust boundaries
- [x] Container inventory with cloud deployment mappings
- [x] Component interactions (sync + async pipelines)
- [x] API contract templates + event schema
- [x] Reporting modules, metrics catalog, dashboards
- [x] Implementation starter (Structurizr DSL, auth middleware, reporting jobs)

If a section is missing for a change proposal, add it inline and open a PR
against this file — the HTML companion regenerates from this source.
