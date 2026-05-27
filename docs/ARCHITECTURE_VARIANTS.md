# Opinionated C4 SaaS Architecture Variants on AWS

> Companion to [`ARCHITECTURE.md`](./ARCHITECTURE.md) and
> [`architecture.html`](./architecture.html). This document extends the base
> C4 SaaS template with three opinionated patterns — **modular monolith**,
> **microservices**, and **event-driven SaaS** — so a team can pick a
> practical default based on scale, team structure, operational maturity, and
> integration needs.

## Selection Guide

AWS's SaaS Lens emphasizes that there is no single SaaS architecture that
fits every product, and it recommends decomposing services according to
multi-tenant load and isolation profiles rather than by trend alone. The same
guidance also recommends binding tenant identity to user identity, creating
tenant-aware operational views, and instrumenting tenant metrics so
reliability, cost, and support decisions can be made at the tenant level.

Structurizr is designed to generate multiple C4 diagrams from a single
model, which makes it a good fit for keeping context, container, and
component views synchronized as the architecture evolves. For AWS-native
SaaS teams that want implementation examples, AWS also publishes a
multi-tenant ECS reference architecture sample that provides code and
configuration patterns.

| Pattern             | Best fit                                                                  | Main strength                                | Main tradeoff                                          |
| ------------------- | ------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| Modular monolith    | Early-to-mid-stage SaaS, small platform team, strong domain cohesion      | Fast delivery and simpler operations         | Lower independent scaling and release isolation        |
| Microservices       | Larger product surface, many teams, unequal scaling profiles              | Team autonomy and independent deployment     | Higher platform complexity and integration overhead    |
| Event-driven SaaS   | Workflow-heavy systems, async integrations, analytics-rich products       | Loose coupling and resilient async pipelines | More eventual consistency and observability complexity |

## Variant 1 — Modular Monolith

A modular monolith is usually the strongest default when the domain is
still evolving and the team wants clean boundaries without paying the
operational tax of many services. This aligns with the AWS SaaS Lens
principle that architecture should be chosen according to business and
tenant needs, not by a one-size-fits-all model.

### Recommended shape
- One deployable backend application with strict internal modules such as
  Identity, Billing, Tenant Management, Core Domain, Reporting,
  Notifications, and Audit.
- One relational database (typically Aurora PostgreSQL) with schema-level
  separation by module and tenant-aware access controls.
- One async worker process for reporting, email, exports, and retries —
  backed by SQS and EventBridge.
- One frontend and one admin portal, both using the same API boundary.

### C4 guidance
- **System context:** show a single SaaS platform with external identity,
  billing, email providers, and support users.
- **Container view:** Web UI, Admin UI, API application, Worker, Aurora,
  Redis, S3, Observability.
- **Component view:** break the API application into internal modules
  rather than separate network services.

### Structural requirements
- Module boundaries are enforced in code with package rules + explicit interfaces.
- Database access is owned per module, even within one deployable artifact.
- Long-running / noisy reporting jobs run out of process so the core API
  remains responsive.
- Tenant context is resolved once in middleware and propagated through
  request + job execution paths.

### Good use cases
- B2B SaaS with one main workflow and moderate customization.
- Teams with fewer than 4-6 backend engineers.
- Products that need clean architecture but do not yet need independently
  scaled domain services.

## Variant 2 — Microservices

Microservices are most effective when different domains have clearly
different scaling, isolation, release, or ownership needs. AWS guidance
explicitly recommends decomposing services based on multi-tenant load and
isolation profiles, which is the strongest architectural reason to split
services rather than doing so prematurely.

### Recommended shape
- Separate services for Identity, Tenant Management, Subscription and
  Billing, Core Domain APIs, Reporting, Notifications, Search, and Audit.
- API ingress via API Gateway or ALB; service-to-service traffic inside
  private networks.
- Shared event backbone using EventBridge + SQS; sync REST/gRPC only where
  low-latency coordination is required.
- Dedicated data ownership per service — Aurora, DynamoDB, OpenSearch, or
  S3 chosen per service.

### C4 guidance
- **System context:** unchanged from the modular monolith.
- **Container view:** every major service is a separate container with its
  own datastore or datastore ownership.
- **Component view:** each critical service shows controller, auth, policy,
  domain, persistence, and event-publishing components.

### Structural requirements
- Every service owns its schema and publishes events rather than sharing
  tables.
- Cross-service flows prefer asynchronous choreography unless transactional
  semantics require sync calls.
- Retry, timeout, circuit-breaker, and idempotency rules are standardized
  across services.
- Tenant-aware throttling + isolation controls reduce noisy-neighbor impact.

### Good use cases
- Multiple domain teams deploying independently.
- One or more domains with highly unequal throughput, compute, or
  compliance requirements.
- Products needing selective regionalization, isolation, or premium-tier
  service tiers.

## Variant 3 — Event-Driven SaaS

An event-driven SaaS architecture is best when the product revolves around
workflows, integrations, reporting pipelines, or state changes that
naturally happen asynchronously. AWS's SaaS Lens highlights the value of
instrumenting tenant metrics, supporting growth, and aligning
infrastructure consumption with tenant activity — all of which pair
naturally with event-driven patterns.

### Recommended shape
- Command-facing API layer for writes and user experience.
- Event backbone using EventBridge or Kafka-compatible streaming, plus SQS
  queues for durable worker execution.
- Domain services reacting to events such as `TenantProvisioned`,
  `SubscriptionChanged`, `EntityCreated`, `ReportRequested`,
  `ExportCompleted`.
- Analytics, reporting, notification, and compliance subsystems consume
  event streams independently.

### C4 guidance
- **System context:** emphasize partner systems, webhooks, analytics sinks,
  and notification channels.
- **Container view:** API layer, event bus, command processors, stream
  consumers, reporting pipeline, data lake / S3 exports, observability.
- **Component view:** outbox publisher, event router, consumer handlers,
  replay strategy, deduplication logic.

### Structural requirements
- Every emitted event includes `eventId`, `tenantId`, `occurredAt`,
  `correlationId`, and `schemaVersion`.
- Consumers are idempotent and safe to replay.
- Eventual consistency expectations are documented in UX + API contracts.
- Tenant-level observability includes activity, cost, performance, and
  error insights per event pipeline.

### Good use cases
- Heavy reporting and export workloads (this is JAMNet's listening +
  digest pipeline in production form).
- Products with many integrations, workflow automation, and background
  processing.
- SaaS platforms where downstream systems need near-real-time notifications
  or data feeds.

## Decision Heuristics

Choose the **modular monolith** when speed, simplicity, and strong
in-process domain boundaries matter more than independent deployability.

Choose **microservices** when team boundaries and production scaling
profiles are already forcing service separation.

Choose **event-driven SaaS** when business workflows are naturally
asynchronous and the architecture needs resilient pipelines for
integrations, reporting, and analytics.

A practical path: start with a modular monolith, introduce event-driven
internal patterns for reporting + integrations, and only split selected
modules into services when scaling or ownership data proves the need. That
phased path aligns with AWS guidance to take a data-driven approach to
architecture and performance tradeoffs.

## Diagram Adaptation Notes

Use one Structurizr workspace and maintain all variants as separate views
derived from the same model so changes to actors, systems, and shared
concepts stay consistent. This avoids the common documentation problem
where context, container, and component diagrams drift apart.

Recommended view set per variant:

- `SystemContext`
- `Container_ModMonolith` *or* `Container_Microservices` *or* `Container_EventDriven`
- `Component_API`
- `Component_Reporting`
- `Deployment_AWS_Prod`
- `Dynamic_RequestFlow`
- `Dynamic_ReportGeneration`

## Suggested recommendation defaults

- **New SaaS, one application team:** modular monolith baseline with
  queue-backed reporting and event publication for integrations.
- **Scaling product, multiple teams, premium-tier isolation:** microservices
  variant with tenant-aware throttling, per-service ownership, and richer
  tenant observability.
- **Workflow + analytics heavy product:** event-driven variant with
  explicit schema governance and replay-safe consumers.

## Applied to LitCentral + JAMNet

Today the platform is best modeled as a **modular monolith with an
event-driven reporting/listening pipeline**:

- One web app + one API surface (`src/`) — modular layout (`components/`,
  `lib/`, `pages/`).
- One database (Postgres / Aurora target, per `SUPABASE_INTEGRATION.md`).
- Workers handle adapter polling + nightly digests — the listening engine
  in `src/lib/socialListening.js` is already event-loop-shaped (`startAutomation`).
- When listening reaches enough volume that a single worker pool is
  contended, lift just the listening + reporting subsystem into a separate
  service before splitting the rest of the monolith.

This matches the AWS guidance: start small and modular, evolve to
event-driven where the workload is asynchronous, only split services when
the data says so.
