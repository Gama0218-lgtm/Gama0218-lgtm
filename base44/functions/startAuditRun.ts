/**
 * base44/functions/startAuditRun/entry.ts
 * LitCentral v13 - Audit Run Initiator
 * 
 * Enforces Gate Zero by requiring a frozen ManuscriptVersion
 * Creates audit_run record and invokes auditManuscript function
 * 
 * Input:
 * - manuscript_id (UUID)
 * - create_new_version (bool) - if true, freeze a new ManuscriptVersion
 * 
 * Output:
 * - audit_run with audit_run_id, version_id, status
 */

import { z } from "zod";

export const req = z.object({
  manuscript_id: z.string().uuid(),
  create_new_version: z.boolean().default(true),
  created_by: z.string().default("system")
});

export async function run(req: z.infer<typeof req>, modules: any) {
  const { db, invoke } = modules;
  
  console.log(`[START AUDIT] Manuscript: ${req.manuscript_id}`);
  
  // Check if a frozen ManuscriptVersion already exists
  let versionId = null;
  
  if (req.create_new_version) {
    console.log(`[START AUDIT] Creating new frozen ManuscriptVersion...`);
    
    // Compute version hash
    const manuscriptContent = await db.query(
      "SELECT * FROM manuscripts WHERE manuscript_id = ?",
      [req.manuscript_id]
    );
    
    if (!manuscriptContent[0]) {
      return {
        success: false,
        error: `Manuscript not found: ${req.manuscript_id}`
      };
    }
    
    const versionHash = computeSHA256(JSON.stringify(manuscriptContent[0]));
    
    // Get next version number
    const lastVersion = await db.query(
      "SELECT MAX(version_number) as max_version FROM manuscript_versions WHERE manuscript_id = ?",
      [req.manuscript_id]
    );
    
    const nextVersionNumber = (lastVersion[0]?.max_version || 0) + 1;
    
    // Check canonical chapter count (Gate Zero prerequisite)
    const canonicalCount = await db.query(
      "SELECT COUNT(*) as count FROM manuscript_chapters WHERE manuscript_id = ? AND is_canonical = true",
      [req.manuscript_id]
    );
    
    const gateZeroPassed = canonicalCount[0]?.count === 45;
    
    // Create ManuscriptVersion record
    versionId = generateUUID();
    
    await db.insert("manuscript_versions", {
      version_id: versionId,
      manuscript_id: req.manuscript_id,
      version_number: nextVersionNumber,
      version_hash: versionHash,
      gate_zero_passed: gateZeroPassed,
      canonical_chapter_count: canonicalCount[0]?.count || 0,
      frozen_at: new Date().toISOString(),
      created_by: req.created_by,
      audit_run_id: null, // Will be updated after audit starts
      metadata: JSON.stringify({
        gate_zero_enforced: true,
        freeze_reason: "Pre-audit version lock"
      })
    });
    
    console.log(`[START AUDIT] ✓ ManuscriptVersion ${nextVersionNumber} frozen (hash: ${versionHash.substring(0, 8)}...)`);
    console.log(`[START AUDIT] Gate Zero status: ${gateZeroPassed ? "PASSED" : "FAILED"}`);
    
    if (!gateZeroPassed) {
      console.error(`[START AUDIT] GATE ZERO BLOCKED: Expected 45 canonical chapters, found ${canonicalCount[0]?.count}`);
      return {
        success: false,
        gate_zero_passed: false,
        error: `Gate Zero requirement not met: only ${canonicalCount[0]?.count} canonical chapters (need 45)`,
        version_id: versionId
      };
    }
  } else {
    // Use existing frozen version
    const existingVersion = await db.query(
      "SELECT version_id FROM manuscript_versions WHERE manuscript_id = ? AND gate_zero_passed = true ORDER BY version_number DESC LIMIT 1",
      [req.manuscript_id]
    );
    
    if (!existingVersion[0]) {
      return {
        success: false,
        error: `No frozen ManuscriptVersion with Gate Zero pass found. Use create_new_version=true to create one.`
      };
    }
    
    versionId = existingVersion[0].version_id;
    console.log(`[START AUDIT] Using existing frozen version: ${versionId}`);
  }
  
  // Create audit_run record
  const auditRunId = generateUUID();
  
  const lastAuditRun = await db.query(
    "SELECT MAX(audit_run_number) as max_run FROM audit_runs WHERE manuscript_id = ?",
    [req.manuscript_id]
  );
  
  const auditRunNumber = (lastAuditRun[0]?.max_run || 0) + 1;
  
  await db.insert("audit_runs", {
    audit_run_id: auditRunId,
    manuscript_id: req.manuscript_id,
    version_id: versionId,
    audit_run_number: auditRunNumber,
    status: "pending",
    gate_zero_passed: false, // Will be set by auditManuscript
    canonical_chapter_count: 0,
    schema_valid: false,
    started_at: new Date().toISOString(),
    audit_engine_version: "13.0",
    total_findings: 0,
    critical_findings: 0,
    high_findings: 0,
    omega_score: null,
    evidence_completeness: null,
    known_defects_count: 0,
    remediation_tasks_generated: 0,
    metadata: JSON.stringify({
      gate_zero_enforced: true,
      version_frozen: true
    })
  });
  
  console.log(`[START AUDIT] ✓ Audit run created: ${auditRunId}`);
  
  // Invoke auditManuscript function
  console.log(`[START AUDIT] Invoking auditManuscript function...`);
  
  const auditResult = await invoke("auditManuscript", {
    manuscript_id: req.manuscript_id,
    version_id: versionId,
    audit_run_id: auditRunId
  });
  
  if (!auditResult.success) {
    await db.update("audit_runs", { audit_run_id: auditRunId }, { status: "failed" });
    return {
      success: false,
      error: auditResult.error,
      audit_run_id: auditRunId
    };
  }
  
  return {
    success: true,
    audit_run_id: auditRunId,
    version_id: versionId,
    audit_run_number: auditRunNumber,
    status: "completed",
    gate_zero_passed: auditResult.gate_zero_passed,
    gate_one_passed: auditResult.gate_one_passed,
    canonical_chapter_count: auditResult.canonical_chapter_count,
    total_findings: auditResult.total_findings,
    omega_score: auditResult.omega_score,
    evidence_completeness: auditResult.evidence_completeness,
    findings_summary: auditResult.findings_summary
  };
}

function computeSHA256(content: string): string {
  // In a real implementation, use crypto.createHash('sha256')
  // For now, return a placeholder
  return "sha256_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
