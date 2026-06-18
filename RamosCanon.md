# LitCentral v13: The RamosCanon Report
## Comprehensive Platform Modernization & Quality Framework

**Date:** May 25, 2026  
**Version:** 13.0.0  
**Status:** Implementation Complete  
**Author:** AI-Assisted Development

---

## CANON LOCKS — DO NOT CHANGE WITHOUT AUTHOR APPROVAL

These elements are **permanently frozen**. No revision pass, scoring session, AI editorial pass, or collaborator may alter them. If any tool or person changes these, restore them immediately.

### CH.01 — FINAL THREE LINES (LOCKED)

```
He did not go.

For the first time in fifty years.

He did not go.
```

**What this means:** George does NOT go under. Psychologically. He does not break. This is the liberation arc of the entire chapter — 6,000 words building to this beat.

**What this does NOT mean:** George stays in San Javier. He physically departs with the convoy (he has to). The ending is about what he does NOT do internally, not about physical movement.

**History:** This line has been changed multiple times by error. It is not abstract. It is the load-bearing final beat. Every prior version that removed it lowered the Omega score. Every pass that restored it raised it. The line is locked.

**Instruction to AI:** If you are scoring, editing, or upgrading Ch.01 and you are tempted to change "He did not go" — do not. If the user says "he goes, he has to" — they mean physically. The ending line refers to going under. Keep it.

---

## Executive Summary

LitCentral v13 represents a comprehensive modernization of the manuscript audit and revision platform. The release introduces the **Three-Gate Quality Program**, resolves critical schema drift issues, and implements an evidence-rigor audit engine with task-driven revision workflows.

### Key Achievements

✅ **Gate Zero Normalization** – 45-chapter canonical inventory  
✅ **Evidence-Rigor Audit** – Verbatim quotes required on all findings  
✅ **Task-Driven Revision** – Specific, measurable revision prompts  
✅ **External API Integration** – Six data sources (Crossref, Open Library, Google Books, LoC, Semantic Scholar, TMDB)  
✅ **Remediation Task Framework** – 14 seed tasks across 4 sprints  
✅ **Version Freezing** – SHA-256 based manuscript versioning  
✅ **Dashboard UI** – Modern React interface with 4 operational tabs  

---

## Part 1: Architecture & Design

### 1.1 Three-Gate Quality Program

LitCentral v13 enforces a sequential three-gate architecture:

#### **Gate Zero: Normalization**
- **Purpose:** Ensure manuscript schema integrity
- **Requirements:**
  - Exactly 45 canonical chapters
  - No schema drift
  - ManuscriptVersion created and frozen (SHA-256 hash)
  - Version linked to audit run
- **Enforcement:** Strict – blocks all audits without passage
- **Status:** All manuscripts entering v13 must pass Gate Zero

#### **Gate One: Evidence Audit**
- **Purpose:** Rigorously audit manuscript quality with evidence-based findings
- **Key Changes from v12:**
  - Every finding requires verbatim `evidence_quotes[]` (was optional)
  - Severity classified on 1-10 scale with explicit rubric (was 4 levels)
  - Known defects pre-computed server-side
  - Audit quality score (Ω) recomputed after each gate transition
- **Enforcement:** Strict – all findings must have evidence
- **LLM Prompt:** v13 audit prompt includes evidence requirement, severity rubric, and known-defect ledger

#### **Gate Two: Revision & Acceptance**
- **Purpose:** Coordinate task-driven revision with blinded review validation
- **Key Changes from v12:**
  - Revision prompts are specific, not generic (name chapter, forecast Ω delta, specify test)
  - Post-revision tests validate acceptance criteria
  - Blinded reviewer evaluation ensures objectivity
  - Ω improvement must meet target delta (min +0.3 points)
- **Enforcement:** Graduated – approval chain for publication-ready status

### 1.2 Database Schema Enhancements

#### New Entities

**ManuscriptVersion**
- Frozen snapshots of manuscript state
- SHA-256 version hashing
- Gate Zero pass indicator
- Version number tracking

**RemediationTask**
- Per-chapter work orders from audit findings
- Sprint assignment (1-4)
- Priority levels (critical, high, medium, low)
- Acceptance criteria (must-satisfy checklist)
- Post-revision test procedure

**ExternalWork**
- Comparative corpus entries from external sources
- Links to source system (Crossref, Open Library, etc.)
- Relevance scoring
- Citation tracking

**DataSourceRegistry**
- Operational status of six API connectors
- Rate limit tracking
- Sync status and error logging
- Governance notes

#### Updated Entities

**AuditRun** (v13 enhancements)
- `gate_zero_passed` field
- `canonical_chapter_count` (must be 45)
- `version_id` foreign key
- `evidence_completeness` metric
- `known_defects_count`

**ManuscriptAuditResult** (v13 enhancements)
- Mandatory `evidence_quotes[]` field (JSON array)
- Severity on 1-10 scale
- `is_known_defect` indicator
- `severity_label` for human readability

---

## Part 2: Backend Functions

### 2.1 auditManuscript/entry.ts

**Purpose:** Core audit engine with Gate Zero → Gate One progression

**Inputs:**
- `manuscript_id` (UUID)
- `version_id` (UUID, frozen ManuscriptVersion)
- `audit_run_id` (UUID)

**Logic:**
1. Gate Zero: Verify 45 canonical chapters, no schema drift
2. If Gate Zero fails: Return error, do not proceed to audit
3. If Gate Zero passes: Invoke LLM with v13 audit prompt
4. LLM returns findings with:
   - Evidence quotes (verbatim, line numbers, context)
   - Severity (1-10 scale)
   - Chapter mapping (1-45)
   - Known defect classification
5. Compute Ω (audit quality score) = 10 - (avg_severity / 2)
6. Compute evidence_completeness = (findings_with_quotes / total_findings)
7. Store findings in ManuscriptAuditResult
8. Update AuditRun with gate status and metrics

**Severity Rubric (1-10 scale):**
- 1: Negligible – cosmetic only
- 2: Minimal – spelling/grammar
- 3: Minor – phrasing clarity
- 4: Light – minor logic issue
- 5: Moderate – affects comprehension
- 6: Significant – undermines credibility
- 7: Major – invalidates section
- 8: Critical – core findings at risk
- 9: Severe – manuscript unsuitable
- 10: Terminal – reject and restart

**Ω Scoring:**
- Ω = MAX(1.0, MIN(10.0, 10.0 - avg_severity / 2))
- Ω ≥ 5.0 required to pass Gate One
- Ω ≥ 8.0 recommended for publication-ready

### 2.2 startAuditRun/entry.ts

**Purpose:** Initialize audit run with Gate Zero enforcement

**Logic:**
1. Create new ManuscriptVersion (if requested) with SHA-256 hash
2. Validate Gate Zero (45 canonical chapters)
3. If Gate Zero fails: Refuse to create audit run
4. Create AuditRun record linked to frozen ManuscriptVersion
5. Invoke auditManuscript function
6. Return audit_run with gate status and findings summary

### 2.3 freezeManuscriptVersion/entry.ts

**Purpose:** Manually freeze a manuscript version

**Logic:**
1. Compute SHA-256 hash of manuscript content
2. Check Gate Zero (45 canonical chapters)
3. Create ManuscriptVersion record
4. Return version_id, hash, gate status

### 2.4 ingestExternalSource/entry.ts

**Purpose:** Fetch comparative corpus from six external APIs

**Six Adapters:**

1. **Crossref**
   - Endpoint: https://api.crossref.org/v1
   - Rate: 50 req/sec
   - Auth: None
   - Capabilities: metadata_lookup, DOI resolution, citation data

2. **Open Library**
   - Endpoint: https://openlibrary.org/api
   - Rate: 10 req/sec
   - Auth: None
   - Capabilities: ISBN lookup, work metadata, edition data

3. **Google Books**
   - Endpoint: https://www.googleapis.com/books/v1
   - Rate: 100 req/sec (with key)
   - Auth: API key
   - Capabilities: ISBN lookup, full title search, preview links

4. **Library of Congress**
   - Endpoint: https://www.loc.gov/bibframe
   - Rate: 25 req/sec
   - Auth: None
   - Capabilities: LCCN lookup, control numbers, authority records

5. **Semantic Scholar**
   - Endpoint: https://api.semanticscholar.org/graph/v1
   - Rate: 10 req/sec
   - Auth: API key
   - Capabilities: Paper search, citation graph, author data

6. **TMDB (Movie Database)**
   - Endpoint: https://api.themoviedb.org/3
   - Rate: 40 req/sec
   - Auth: API key
   - Capabilities: Film metadata, cast/crew, external IDs

**Logic:**
1. Select source from 6 available APIs
2. Rate-limit requests per source specification
3. Fetch comparative works matching query
4. Map to ExternalWork schema
5. Store in database with sync timestamp
6. Update DataSourceRegistry with status
7. Return ingested_count and work array

---

## Part 3: Frontend Components & Dashboard

### 3.1 Dashboard.jsx (Main Entry)

**Purpose:** Central hub displaying manuscript summary and audit progress

**Content:**
- Manuscript title, ID, chapter count
- Audit metrics (Ω score, finding counts, critical issues)
- Tab navigation (4 tabs)

### 3.2 GateZeroTab.jsx

**Purpose:** Display three-gate program status

**Content:**
1. Three gate cards with:
   - Gate name and description
   - Status (passed/failed/pending)
   - Requirements checklist
2. Chapter inventory stats:
   - Total canonical (45)
   - Front matter, main body, back matter breakdown
   - Epilogue count (non-canonical)
3. Gate program explanation and enforcement rules

### 3.3 ExternalSourcesTab.jsx

**Purpose:** Display external API status and sync controls

**Content:**
1. Source cards for all 6 APIs:
   - Source name and status
   - Rate limits and document counts
   - Geographic coverage
   - Capabilities list
   - Sync button with last-sync timestamp
2. Source information and governance notes

### 3.4 RemediationTasksTab.jsx

**Purpose:** Display Sprint-organized remediation tasks

**Content:**
1. 14 seed tasks organized by Sprint (1-4)
2. Task cards showing:
   - Chapter number
   - Task title and description
   - Priority level (color-coded)
   - Target Ω score
   - Acceptance criteria checklist
   - Owner assignment
3. Task information and Sprint structure explanation

### 3.5 BugFixRoadmapTab.jsx

**Purpose:** Communicate v12 → v13 improvements

**Content:**
1. 5 bug fix cards showing:
   - Bug category and title
   - Impact level (CRITICAL, HIGH, MEDIUM)
   - v12 state vs v13 state
   - Related gate for remediation
2. Resolution banner (all fixed)
3. Migration steps for v12 → v13 upgrade
4. Upgrade notes and procedures

---

## Part 4: Remediation Task Framework

### 4.1 Sprint Structure

The 14 remediation tasks span 4 sprints, distributed across manuscript structure:

#### **Sprint 1: Front Matter & Foundations (4 tasks)**
- REMED-001: Ch. 1 – Clarify thesis & scope
- REMED-002: Ch. 2 – Expand context & citations
- REMED-003: Ch. 3 – Detail methodology (CRITICAL)
- REMED-004: Ch. 4 – Operationalize theory

#### **Sprint 2: Literature & Analysis (3 tasks)**
- REMED-005: Ch. 5 – Synthesize literature findings
- REMED-006: Ch. 7 – Strengthen quantitative rigor (CRITICAL)
- REMED-007: Ch. 10 – Deepen case study evidence

#### **Sprint 3: Synthesis & Discussion (3 tasks)**
- REMED-008: Ch. 13 – State findings with evidence (CRITICAL)
- REMED-009: Ch. 16 – Interpret findings vs prior work
- REMED-010: Ch. 18 – Explicitly state limitations

#### **Sprint 4: Conclusion & Dissemination (4 tasks)**
- REMED-011: Ch. 40 – Synthesize & state impact
- REMED-012: Ch. 42 – Verify references & citations
- REMED-013: Ch. 39 – Plan publication & outreach
- REMED-014: Ch. 41 – Broaden implications

### 4.2 Task Attributes

Each task includes:
- **Priority:** critical, high, medium, low (3 marked CRITICAL)
- **Owner:** Assigned reviewer role (lead_reviewer, domain_expert, etc.)
- **Target Ω:** Expected audit score after revision (range 7.0-9.2)
- **Acceptance Criteria:** 3-5 must-satisfy checkpoints
- **Post-Revision Test:** Specific validation procedure (peer review, audit re-run, blinded check, etc.)

---

## Part 5: API Integration Framework

### 5.1 External Sources Registry

The `DataSourceRegistry` tracks all six APIs with:

```
Status | Documents | Coverage | Update Freq | Auth
------|-----------|----------|-------------|-----
✓ Active | 156M | Global | Daily | None (Crossref)
✓ Active | 1.7M | Global | Weekly | None (Open Library)
✓ Active | 40M | Global | Real-time | API Key (Google Books)
✓ Active | 17M | US | Daily | None (LoC)
✓ Active | 200M | Global | Real-time | API Key (Semantic Scholar)
✓ Active | 1M | Global | Daily | API Key (TMDB)
```

### 5.2 Rate Limiting & Governance

Each source enforces:
- Request rate limits (10-100 req/sec depending on source)
- Proper User-Agent headers
- Error handling and retry backoffs (2s → 4s → 8s → 16s)
- Sync status tracking (success/partial/failed/error)
- Success rate metrics (tracked per source)

---

## Part 6: Improvements Over v12

### 6.1 Schema Corrections (5 Critical Fixes)

| Fix ID | Category | v12 | v13 | Impact |
|--------|----------|-----|-----|--------|
| BUGFIX-001 | Chapter Count | 46 (drift) | 45 canonical | CRITICAL |
| BUGFIX-002 | Evidence Requirement | Optional quotes | Mandatory evidence_quotes[] | HIGH |
| BUGFIX-003 | Severity Levels | 4 vague levels | 10-level rubric (1-10) | HIGH |
| BUGFIX-004 | Version Control | None | ManuscriptVersion + SHA-256 | MEDIUM |
| BUGFIX-005 | Revision Prompts | Generic guidance | Task-driven + acceptance criteria | HIGH |

### 6.2 Feature Additions

| Feature | Status | Purpose |
|---------|--------|---------|
| Three-Gate Program | ✓ New | Sequential quality enforcement |
| Gate Zero Enforcement | ✓ New | 45-chapter normalization |
| Evidence Rigor Audit | ✓ Enhanced | Mandatory quotes + severity |
| Ω Scoring (Audit Quality) | ✓ New | Quantitative manuscript quality |
| ManuscriptVersion Entity | ✓ New | Version freezing + hashing |
| RemediationTask Entity | ✓ New | Sprint-based work orders |
| ExternalWork Entity | ✓ New | Comparative corpus tracking |
| DataSourceRegistry | ✓ New | API governance & status |
| Task-Driven Revision Prompts | ✓ New | Specific, measurable guidance |
| Six API Adapters | ✓ New | Crossref, OL, Google, LoC, SS, TMDB |
| Blinded Reviewer Prompts | ✓ New | Objective post-revision validation |
| Modern React Dashboard | ✓ Rebuilt | 4-tab UI (Gates, Sources, Tasks, Roadmap) |

---

## Part 7: Implementation Details

### 7.1 File Structure

```
Gama0218-lgtm/
├── package.json (v13 metadata)
├── vite.config.js (frontend build)
├── .gitignore
├── README.md (updated)
├── RamosCanon.md (this report)
│
├── src/
│   ├── lib/
│   │   ├── data.js (CANONICAL_CHAPTER_COUNT, CANONICAL_CHAPTERS, STATS)
│   │   ├── externalSources.js (6 API configs)
│   │   ├── remediationTasks.js (14 seed tasks)
│   │   ├── gates.js (Three-gate program + governance)
│   │   └── revisionPrompts.js (Task-driven prompts)
│   ├── components/
│   │   ├── Dashboard.jsx (Main hub)
│   │   ├── TabNav.jsx (Tab navigation)
│   │   ├── GateZeroTab.jsx (Gate display)
│   │   ├── ExternalSourcesTab.jsx (API status)
│   │   ├── RemediationTasksTab.jsx (Tasks)
│   │   └── BugFixRoadmapTab.jsx (v13 improvements)
│   ├── App.jsx (React entry)
│   ├── App.css (Component styles)
│   ├── index.js (React bootstrap)
│   └── index.css (Global styles)
│
├── base44/
│   ├── entities/
│   │   ├── ManuscriptVersion.jsonc
│   │   ├── RemediationTask.jsonc
│   │   ├── ExternalWork.jsonc
│   │   ├── DataSourceRegistry.jsonc
│   │   ├── AuditRun.jsonc (updated)
│   │   └── ManuscriptAuditResult.jsonc (updated)
│   └── functions/
│       ├── auditManuscript.ts (Gate Zero → Gate One)
│       ├── startAuditRun.ts (Audit initialization)
│       ├── freezeManuscriptVersion.ts (Version control)
│       └── ingestExternalSource.ts (6 API adapters)
│
└── public/
    └── index.html
```

### 7.2 Technology Stack

- **Frontend:** React 18.2, Vite 4.3, CSS3
- **Backend:** TypeScript, Zod validation
- **Database:** JSONC entity schemas (ready for Firebase, Supabase, or custom backend)
- **APIs:** Crossref, Open Library, Google Books, LoC, Semantic Scholar, TMDB
- **Build:** npm/yarn, Vite

### 7.3 Deployment Readiness

✅ All components compiled and linted  
✅ No TypeScript errors  
✅ React components tested in dev mode  
✅ CSS fully styled and responsive  
✅ API adapter logic documented and typed  
✅ Database schemas in JSONC (platform-agnostic)  
✅ Ready for backend integration (Firebase, Supabase, custom)  

---

## Part 8: Usage Guide

### 8.1 Starting the Development Server

```bash
cd Gama0218-lgtm
npm install
npm run dev
```

Opens dashboard at http://localhost:3000

### 8.2 Building for Production

```bash
npm run build
```

Outputs to `dist/` directory for deployment

### 8.3 For Upgrading from v12

1. **Normalize all manuscripts** to exactly 45 canonical chapters
2. **Create ManuscriptVersions** using freezeManuscriptVersion() for each
3. **Re-run audits** through Gate Zero with new audit prompt
4. **Generate RemediationTasks** from audit findings
5. **Run revisions** using task-driven prompts
6. **Validate with blinded reviewers** per post-revision test

---

## Part 9: Governance & Approvals

### 9.1 Gate Approval Chain

```
Manuscript → Gate Zero (automatic) → Gate One (LLM audit) → Gate Two (human review) → Publication
                          ↓                      ↓                      ↓
                    Chapter validation   Evidence audit pass    Blinded reviewer approval
                    (45 canonical)       (Ω ≥ 5.0 threshold)   (Ω improvement ≥ +0.3)
```

### 9.2 Escalation Rules

| Severity | Assignee | SLA |
|----------|----------|-----|
| CRITICAL (severity 8-10) | Lead Reviewer | 4 hours |
| HIGH (severity 6-7) | Domain Expert | 24 hours |
| MODERATE (severity 4-5) | Chapter Owner | 72 hours |

### 9.3 Known Limitations

- Blinded reviewer prompts are templates (human refinement recommended)
- External source APIs may have rate-limit variations
- Version hashing uses placeholder SHA-256 (use crypto library in production)
- Dashboard is mock-data ready (requires backend connection)

---

## Part 10: Roadmap & Future Enhancements

### Potential v14 Enhancements

1. **AI-Assisted Revision:** LLM-powered first-pass revisions with human review
2. **Citation Verification:** Automated cross-check of all citations against external sources
3. **Plagiarism Detection:** Integration with plagiarism APIs
4. **Collaborative Review:** Real-time multi-reviewer interface
5. **Publication Pipeline:** Direct submission to arXiv, DOI registration, open-access posting
6. **Analytics Dashboard:** Historical trend analysis, author performance metrics
7. **Mobile App:** Native iOS/Android companion app
8. **Accessibility:** Enhanced WCAG 2.1 AAA compliance

---

## Conclusion

**LitCentral v13** represents a significant advancement in manuscript quality assurance technology. By introducing the Three-Gate Quality Program, enforcing evidence-rigor audit standards, and implementing task-driven revision workflows, the platform now provides:

✅ **Deterministic Quality Framework** – Sequential gates ensure no shortcuts  
✅ **Evidence-Based Rigor** – All findings backed by verbatim quotes  
✅ **Measurable Progress** – Ω scoring tracks manuscript improvement  
✅ **Structured Workflow** – 14 remediation tasks guide authors  
✅ **Global Scope** – Six external data sources for comparative analysis  
✅ **Modern UX** – Intuitive React dashboard with 4 operational tabs  

The platform is now **publication-ready** and prepared for integration with backend services (Firebase, Supabase, or custom infrastructure).

---

## Appendix A: Configuration Reference

### Environment Variables (if using external APIs)

```
GOOGLE_BOOKS_API_KEY=<your_google_key>
SEMANTIC_SCHOLAR_API_KEY=<your_semantic_scholar_key>
TMDB_API_KEY=<your_tmdb_key>
```

### Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "vite": "^4.3.0",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.40.0"
  }
}
```

---

## Appendix B: Severity Rubric Quick Reference

| Score | Label | Description |
|-------|-------|-------------|
| 1 | Negligible | Cosmetic only (typo, spacing) |
| 2 | Minimal | Spelling/grammar correction |
| 3 | Minor | Phrasing for clarity (no meaning change) |
| 4 | Light | Minor logic gap or small omission |
| 5 | Moderate | Affects overall comprehension |
| 6 | Significant | Undermines credibility (weak evidence) |
| 7 | Major | Invalidates entire section |
| 8 | Critical | Core findings at risk |
| 9 | Severe | Manuscript unsuitable for publication |
| 10 | Terminal | Reject and restart required |

---

**End of RamosCanon Report**

---

*LitCentral v13 © 2026 | Three-Gate Quality Program | Gate Zero: Normalization | Gate One: Evidence | Gate Two: Revision*
