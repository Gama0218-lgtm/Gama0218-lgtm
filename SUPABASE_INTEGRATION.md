# LitCentral v13 + Supabase Integration Guide

**Date:** May 25, 2026  
**Status:** Integration Setup  
**Backend:** Supabase (PostgreSQL + REST API)

---

## Part 1: Supabase Project Setup

### 1.1 Create Supabase Project

1. Visit https://supabase.com/dashboard
2. Click "New Project"
3. Enter project details:
   - Name: `litcentral-v13`
   - Password: Generate strong password
   - Region: Choose closest to users (e.g., us-east-1)
4. Click "Create new project" (takes ~5 minutes)

### 1.2 Retrieve Credentials

Once project is created, navigate to **Settings → API**:

- **Project URL:** `https://[project-id].supabase.co`
- **Public Anon Key:** For client-side auth
- **Service Role Key:** For server-side operations (keep secret)

Save these credentials for `.env` configuration.

---

## Part 2: Database Schema Migration

### 2.1 Create Tables in Supabase

Connect to Supabase SQL Editor and run the following SQL to create all tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ManuscriptVersion table
CREATE TABLE manuscript_versions (
  version_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manuscript_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  version_hash VARCHAR(64) NOT NULL UNIQUE,
  gate_zero_passed BOOLEAN DEFAULT true,
  canonical_chapter_count INTEGER DEFAULT 45,
  frozen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  audit_run_id UUID,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_manuscript_versions_manuscript_id ON manuscript_versions(manuscript_id);
CREATE INDEX idx_manuscript_versions_version_hash ON manuscript_versions(version_hash);
CREATE INDEX idx_manuscript_versions_audit_run_id ON manuscript_versions(audit_run_id);

-- RemediationTask table
CREATE TABLE remediation_tasks (
  task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manuscript_id UUID NOT NULL,
  chapter_id INTEGER NOT NULL,
  chapter_name VARCHAR(255),
  sprint INTEGER CHECK (sprint >= 1 AND sprint <= 4),
  priority VARCHAR(20) CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  owner VARCHAR(255),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  delta_omega_target DECIMAL(3,1),
  acceptance_criteria JSONB,
  post_revision_test TEXT,
  status VARCHAR(30) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'blocked')),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  revision_attempt INTEGER DEFAULT 0,
  audit_run_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_remediation_tasks_manuscript_chapter ON remediation_tasks(manuscript_id, chapter_id);
CREATE INDEX idx_remediation_tasks_sprint ON remediation_tasks(sprint);
CREATE INDEX idx_remediation_tasks_status ON remediation_tasks(status);
CREATE INDEX idx_remediation_tasks_owner ON remediation_tasks(owner);

-- ExternalWork table
CREATE TABLE external_works (
  work_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manuscript_id UUID NOT NULL,
  source_id VARCHAR(50) NOT NULL,
  external_id VARCHAR(255),
  title VARCHAR(500),
  authors JSONB,
  published_year INTEGER,
  publication_venue VARCHAR(500),
  work_type VARCHAR(50) CHECK (work_type IN ('journal_article', 'book', 'book_chapter', 'conference_paper', 'dataset', 'thesis', 'film', 'other')),
  cited_in_manuscript BOOLEAN DEFAULT false,
  relevance_score DECIMAL(3,2) CHECK (relevance_score >= 0.0 AND relevance_score <= 1.0),
  abstract TEXT,
  url VARCHAR(2048),
  metadata JSONB,
  synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_external_works_manuscript ON external_works(manuscript_id);
CREATE INDEX idx_external_works_source_external_id ON external_works(source_id, external_id);
CREATE INDEX idx_external_works_citation ON external_works(cited_in_manuscript);
CREATE INDEX idx_external_works_relevance ON external_works(relevance_score);

-- DataSourceRegistry table
CREATE TABLE data_source_registry (
  registry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id VARCHAR(50) UNIQUE NOT NULL,
  source_name VARCHAR(255),
  api_endpoint VARCHAR(2048),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'degraded', 'offline', 'maintenance')),
  auth_type VARCHAR(30) CHECK (auth_type IN ('none', 'api_key', 'oauth2', 'bearer_token')),
  rate_limit_requests INTEGER,
  rate_limit_window_seconds INTEGER,
  documents_indexed BIGINT DEFAULT 0,
  geographic_coverage VARCHAR(500),
  update_frequency VARCHAR(100),
  last_sync_at TIMESTAMP,
  last_sync_status VARCHAR(20) CHECK (last_sync_status IN ('success', 'partial', 'failed', 'error')),
  last_error_message TEXT,
  sync_attempts_total INTEGER DEFAULT 0,
  sync_attempts_failed INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2),
  avg_response_time_ms INTEGER,
  enabled BOOLEAN DEFAULT true,
  governance_notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_data_source_registry_status ON data_source_registry(status);
CREATE INDEX idx_data_source_registry_enabled ON data_source_registry(enabled);

-- AuditRun table (updated for v13)
CREATE TABLE audit_runs (
  audit_run_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manuscript_id UUID NOT NULL,
  version_id UUID,
  gate_zero_passed BOOLEAN DEFAULT true,
  canonical_chapter_count INTEGER DEFAULT 45,
  status VARCHAR(30) DEFAULT 'pending',
  omega_score DECIMAL(3,1),
  findings_count INTEGER DEFAULT 0,
  critical_findings INTEGER DEFAULT 0,
  evidence_completeness DECIMAL(3,2),
  known_defects_count INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_runs_manuscript ON audit_runs(manuscript_id);
CREATE INDEX idx_audit_runs_version ON audit_runs(version_id);
CREATE INDEX idx_audit_runs_status ON audit_runs(status);

-- ManuscriptAuditResult table (updated for v13)
CREATE TABLE manuscript_audit_results (
  result_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_run_id UUID NOT NULL,
  manuscript_id UUID NOT NULL,
  chapter_id INTEGER,
  finding_type VARCHAR(100),
  description TEXT,
  evidence_quotes JSONB NOT NULL,
  severity INTEGER CHECK (severity >= 1 AND severity <= 10),
  severity_label VARCHAR(50),
  is_known_defect BOOLEAN DEFAULT false,
  known_defect_id VARCHAR(255),
  remediation_task_id UUID,
  location_start INTEGER,
  location_end INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_results_audit_run ON manuscript_audit_results(audit_run_id);
CREATE INDEX idx_audit_results_manuscript ON manuscript_audit_results(manuscript_id);
CREATE INDEX idx_audit_results_chapter ON manuscript_audit_results(chapter_id);
CREATE INDEX idx_audit_results_severity ON manuscript_audit_results(severity);

-- Insert seed data for DataSourceRegistry
INSERT INTO data_source_registry (source_id, source_name, api_endpoint, status, auth_type, rate_limit_requests, rate_limit_window_seconds, documents_indexed, geographic_coverage, update_frequency, enabled)
VALUES
  ('crossref', 'Crossref', 'https://api.crossref.org/v1', 'active', 'none', 50, 1, 156000000, 'Global', 'Daily', true),
  ('open_library', 'Open Library', 'https://openlibrary.org/api', 'active', 'none', 10, 1, 1700000, 'Global', 'Weekly', true),
  ('google_books', 'Google Books', 'https://www.googleapis.com/books/v1', 'active', 'api_key', 100, 1, 40000000, 'Global', 'Real-time', true),
  ('loc', 'Library of Congress', 'https://www.loc.gov/bibframe', 'active', 'none', 25, 1, 17000000, 'US', 'Daily', true),
  ('semantic_scholar', 'Semantic Scholar', 'https://api.semanticscholar.org/graph/v1', 'active', 'api_key', 10, 1, 200000000, 'Global', 'Real-time', true),
  ('tmdb', 'TMDB (Movie Database)', 'https://api.themoviedb.org/3', 'active', 'api_key', 40, 1, 1000000, 'Global', 'Daily', true);
```

### 2.2 Enable Row Level Security (RLS)

For security, enable RLS on tables:

```sql
ALTER TABLE manuscript_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_source_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuscript_audit_results ENABLE ROW LEVEL SECURITY;

-- Create public policy (for demo, use authenticated policies in production)
CREATE POLICY "Enable read access for all users" ON manuscript_versions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON remediation_tasks FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON external_works FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON data_source_registry FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON audit_runs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON manuscript_audit_results FOR SELECT USING (true);
```

---

## Part 3: Environment Configuration

### 3.1 Create .env File

Create `.env` at project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (for server-side only)

# External API Keys
VITE_GOOGLE_BOOKS_API_KEY=your_google_books_key_here
VITE_SEMANTIC_SCHOLAR_API_KEY=your_semantic_scholar_key_here
VITE_TMDB_API_KEY=your_tmdb_key_here

# App Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENVIRONMENT=development
```

### 3.2 Update vite.config.js

Ensure environment variables are properly exposed:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    'process.env': process.env,
  },
})
```

---

## Part 4: Supabase Client Setup

### 4.1 Install Dependencies

```bash
npm install @supabase/supabase-js axios
```

### 4.2 Create Supabase Client Helper

Create `src/lib/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function for authenticated requests
export const getAuthHeader = async () => {
  const session = await supabase.auth.getSession()
  return {
    Authorization: `Bearer ${session.data.session?.access_token || ''}`,
  }
}
```

---

## Part 5: Backend API Functions

### 5.1 Create Server-Side Functions (Supabase Edge Functions)

Create `supabase/functions/audit-manuscript/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { manuscript_id, version_id, audit_run_id } = await req.json()

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // Verify Gate Zero (45 canonical chapters)
    const { data: manuscriptData } = await supabase
      .from("manuscript_versions")
      .select("canonical_chapter_count, gate_zero_passed")
      .eq("version_id", version_id)
      .single()

    if (!manuscriptData?.gate_zero_passed || manuscriptData?.canonical_chapter_count !== 45) {
      return new Response(
        JSON.stringify({ error: "Gate Zero validation failed" }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Call LLM audit (placeholder - integrate with your LLM service)
    const auditFindings = [] // TODO: Call LLM with v13 prompt

    // Compute Ω score
    const avgSeverity = auditFindings.length > 0
      ? auditFindings.reduce((sum, f) => sum + f.severity, 0) / auditFindings.length
      : 5.0
    const omegaScore = Math.max(1.0, Math.min(10.0, 10.0 - avgSeverity / 2))

    // Store findings in database
    for (const finding of auditFindings) {
      await supabase
        .from("manuscript_audit_results")
        .insert({
          audit_run_id,
          manuscript_id,
          chapter_id: finding.chapter_id,
          finding_type: finding.type,
          description: finding.description,
          evidence_quotes: finding.evidence_quotes,
          severity: finding.severity,
          severity_label: finding.severity_label,
          is_known_defect: finding.is_known_defect,
        })
    }

    // Update audit run
    await supabase
      .from("audit_runs")
      .update({
        status: "completed",
        omega_score: omegaScore,
        findings_count: auditFindings.length,
        completed_at: new Date(),
      })
      .eq("audit_run_id", audit_run_id)

    return new Response(
      JSON.stringify({
        audit_run_id,
        omega_score: omegaScore,
        findings_count: auditFindings.length,
        gate_zero_passed: true,
      }),
      { headers: corsHeaders }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    )
  }
})
```

---

## Part 6: Frontend Integration

### 6.1 Update Dashboard.jsx to Call Real Endpoints

Replace mock data fetching with real API calls:

```javascript
// src/components/Dashboard.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import TabNav from './TabNav'
import GateZeroTab from './GateZeroTab'
import ExternalSourcesTab from './ExternalSourcesTab'
import RemediationTasksTab from './RemediationTasksTab'
import BugFixRoadmapTab from './BugFixRoadmapTab'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('gates')
  const [auditData, setAuditData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAuditData() {
      try {
        // Fetch latest audit run
        const { data: auditRuns, error: auditError } = await supabase
          .from('audit_runs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)

        if (auditError) throw auditError

        // Fetch findings for this audit
        const { data: findings, error: findingsError } = await supabase
          .from('manuscript_audit_results')
          .select('*')
          .eq('audit_run_id', auditRuns[0].audit_run_id)

        if (findingsError) throw findingsError

        // Fetch remediation tasks
        const { data: tasks, error: tasksError } = await supabase
          .from('remediation_tasks')
          .select('*')
          .order('sprint', { ascending: true })

        if (tasksError) throw tasksError

        setAuditData({
          manuscript_id: auditRuns[0].manuscript_id,
          title: 'Manuscript Under Review',
          chapter_count: auditRuns[0].canonical_chapter_count,
          status: auditRuns[0].status,
          gate_zero_passed: auditRuns[0].gate_zero_passed,
          omega_score: auditRuns[0].omega_score,
          findings_count: findings.length,
          critical_findings: findings.filter(f => f.severity >= 8).length,
          tasks,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAuditData()
  }, [])

  if (loading) return <div className="dashboard">Loading...</div>
  if (error) return <div className="dashboard error">Error: {error}</div>
  if (!auditData) return <div className="dashboard">No audit data found</div>

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📚 LitCentral v13 - Manuscript Audit Platform</h1>
        <p>Three-Gate Quality Program | Gate Zero: Normalization | Gate One: Evidence | Gate Two: Revision</p>
      </header>

      <div className="manuscript-summary">
        <div className="info-card">
          <h2>{auditData.title}</h2>
          <p>ID: {auditData.manuscript_id}</p>
          <p>Chapters: {auditData.chapter_count}</p>
          <p>Status: {auditData.status}</p>
        </div>

        <div className="metrics-card">
          <h3>Audit Metrics</h3>
          <p>Gate Zero: {auditData.gate_zero_passed ? '✅ Passed' : '❌ Failed'}</p>
          <p>Ω Score: {auditData.omega_score?.toFixed(1) || 'N/A'}</p>
          <p>Findings: {auditData.findings_count}</p>
          <p>Critical: {auditData.critical_findings}</p>
        </div>
      </div>

      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'gates' && <GateZeroTab auditData={auditData} />}
      {activeTab === 'sources' && <ExternalSourcesTab />}
      {activeTab === 'tasks' && <RemediationTasksTab tasks={auditData.tasks} />}
      {activeTab === 'roadmap' && <BugFixRoadmapTab />}
    </div>
  )
}
```

---

## Part 7: Testing & Validation

### 7.1 Test Database Connection

```bash
npm run dev
# Navigate to http://localhost:3000
# Check browser console for Supabase connection messages
```

### 7.2 Test Data Insertion

In Supabase SQL Editor, verify data is readable:

```sql
SELECT COUNT(*) as total_audits FROM audit_runs;
SELECT COUNT(*) as total_findings FROM manuscript_audit_results;
SELECT COUNT(*) as total_tasks FROM remediation_tasks;
```

### 7.3 Test API Endpoints

Use curl or Postman to test endpoints:

```bash
# Test audit manuscript endpoint
curl -X POST http://localhost:3000/api/audit-manuscript \
  -H "Content-Type: application/json" \
  -d '{"manuscript_id":"...", "version_id":"...", "audit_run_id":"..."}'
```

---

## Part 8: Deployment to Production

### 8.1 Production Environment Variables

Create `.env.production`:

```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=<production-key>
VITE_GOOGLE_BOOKS_API_KEY=<production-key>
VITE_SEMANTIC_SCHOLAR_API_KEY=<production-key>
VITE_TMDB_API_KEY=<production-key>
VITE_ENVIRONMENT=production
```

### 8.2 Build & Deploy

```bash
npm run build
# Deploy dist/ folder to Vercel, Netlify, Firebase Hosting, etc.
```

---

## Troubleshooting

### Connection Issues

**Error:** "Failed to connect to Supabase"
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in .env
- Check Supabase project status at https://supabase.com/dashboard

### Permission Denied

**Error:** "Row Level Security violation"
- Ensure RLS policies are created
- Verify user is authenticated (or adjust policies for public access during development)

### Rate Limiting

**Error:** "429 Too Many Requests"
- Implement exponential backoff in API calls
- Check DataSourceRegistry for rate limits

---

## Next Steps

1. ✅ Create Supabase project
2. ✅ Run SQL schema setup
3. ✅ Configure environment variables
4. ✅ Install client library
5. ✅ Update Dashboard.jsx
6. ✅ Test API connections
7. ✅ Deploy to production

**Reference:** [Supabase Docs](https://supabase.com/docs)
