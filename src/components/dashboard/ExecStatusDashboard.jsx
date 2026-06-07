// QUARANTINED — reads live data for display only. Zero writes.
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

function KPI({ value, label, note, color = "text-foreground" }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <div className={`text-2xl font-black font-mono leading-none ${color}`}>{value}</div>
      <div className="text-[7.5px] font-mono tracking-widest uppercase text-muted-foreground mt-1">{label}</div>
      {note && <div className="text-[9px] text-muted-foreground/60 mt-1">{note}</div>}
    </div>
  );
}

function SevBadge({ sev }) {
  const map = {
    CRITICAL: "bg-red/20 text-red border border-red/30",
    HIGH:     "bg-orange/20 text-orange border border-orange/30",
    MED:      "bg-gold/20 text-gold border border-gold/30",
    LOW:      "bg-secondary text-muted-foreground border border-border",
    P0:       "bg-red/20 text-red border border-red/30",
    P1:       "bg-orange/20 text-orange border border-orange/30",
    P2:       "bg-gold/20 text-gold border border-gold/30",
    P3:       "bg-secondary text-muted-foreground border border-border",
  };
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[7px] font-black font-mono whitespace-nowrap ${map[sev] || map.LOW}`}>
      {sev}
    </span>
  );
}

function StatusPill({ ok, yes, no }) {
  return ok
    ? <span className="text-[8px] font-mono font-black text-teal">{yes || "YES ✓"}</span>
    : <span className="text-[8px] font-mono font-black text-red">{no || "NO ✗"}</span>;
}

const RELEASE_CHECKLIST = [
  { sev:"P0", text:"Author decision declared on Dup Pair A (Ch17/Ch18)" },
  { sev:"P0", text:"Author decision declared on Dup Pair B (Ch14/Ch22)" },
  { sev:"P0", text:"Author decision declared on Dup Pair C (Ch26/Ch27)" },
  { sev:"P0", text:"Ch.8 revision pass completed — BIS deficit resolved, Omega gap closed" },
  { sev:"P1", text:"Ch.40 death timeline reconciled with Ch.45 testimony" },
  { sev:"P1", text:"Ghost Protocol quartet foreshadowing seeded (Ch.5, Ch.17/35, Ch.42)" },
  { sev:"P1", text:"Author's note + historical note + source list appended to v17" },
  { sev:"P1", text:"Publisher / imprint decision finalized" },
  { sev:"P2", text:"Passive-voice audits completed (Ch.25, Ch.35, Ch.45)" },
  { sev:"P2", text:"Code-switch additions completed (Ch.2, Ch.6, Ch.9, Ch.29, Ch.37)" },
  { sev:"P2", text:"Ramirez/Rodriguez name swap fixed — Ch.10" },
  { sev:"P3", text:"v16 locked as single source of truth — LITCENTRAL + Elasticsearch re-indexed" },
  { sev:"P3", text:"Elasticsearch dense-vector dims bug resolved (1536 → 384 or 1024)" },
  { sev:"P3", text:"Cover finalized — hybrid current art + new type + author initials" },
  { sev:"P3", text:"Yaqui cultural authority consult completed + documented" },
];

export default function ExecStatusDashboard() {
  const { data: auditRuns = [] } = useQuery({
    queryKey: ["auditRuns-exec"],
    queryFn: () => base44.entities.AuditRun.list("-created_date", 5),
  });

  const { data: quarantine = [] } = useQuery({
    queryKey: ["quarantine-exec"],
    queryFn: () => base44.entities.QuarantineItem.list("-created_date", 200),
  });

  const { data: claims = [] } = useQuery({
    queryKey: ["claims-exec"],
    queryFn: () => base44.entities.ClaimsLedger.list("-created_date", 200),
  });

  // Derived
  const latestRun = auditRuns[0];
  const openFlags = quarantine.filter(q => q.status === "quarantined");
  const critFlags = openFlags.filter(q => q.severity === "CRITICAL");
  const highFlags = openFlags.filter(q => q.severity === "HIGH");

  const pendingClaims   = claims.filter(c => c.verification_status === "unverified" || c.verification_status === "needs-source");
  const verifiedClaims  = claims.filter(c => c.verification_status === "verified");
  const blockerClaims   = claims.filter(c => c.submission_blocker && c.verification_status !== "verified");
  const verifyPct = claims.length ? Math.round((verifiedClaims.length / claims.length) * 100) : 0;

  const auditComplete = latestRun?.status === "complete";
  const auditPct = latestRun && latestRun.total_chapters
    ? Math.round((latestRun.processed_chapters / latestRun.total_chapters) * 100) : 0;

  return (
    <div className="space-y-4">

      {/* Quarantine isolation status */}
      <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">⚠</span>
          <span className="text-[11px] font-black font-mono text-amber-400 tracking-widest uppercase">Quarantine — Beta Reporting Data</span>
          <span className="ml-auto text-[8px] font-mono font-bold text-amber-600 bg-amber-900/40 border border-amber-800/50 px-2 py-0.5 rounded">BETA / LOCKED</span>
        </div>
        <p className="text-[9px] font-mono text-amber-600/80 leading-relaxed mb-3">
          Full audit + SPSS analysis · LITCENTRAL v12 · June 6 2026 · Data stays inside this tab only — does not report to, sync with, or write to the master LITCENTRAL platform.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label:"Reports to master",    ok:true  },
            { label:"Writes to Supabase",   ok:true  },
            { label:"Calls Base44 functions",ok:true  },
            { label:"Data source",          ok:true, yes:"THIS TAB ONLY ✓" },
          ].map(c => (
            <div key={c.label} className="bg-amber-900/30 border border-amber-800/30 rounded-lg px-3 py-2">
              <div className="text-[7px] font-mono text-amber-800/90 uppercase tracking-widest">{c.label}</div>
              <div className="mt-1"><StatusPill ok={c.ok} yes={c.yes} no="NO ✗" /></div>
            </div>
          ))}
        </div>
        <p className="text-[7px] font-mono text-amber-800/60 mt-3">
          Quarantine isolation enforced via QUARANTINE_CONFIG · Promotion requires Beta Master Prompt v1.0 §07 sign-off · Los records mienten
        </p>
      </div>

      {/* Version comparison */}
      <div className="grid grid-cols-3 border border-border rounded-xl overflow-hidden">
        {[
          { head:"◉ LITCENTRAL v12 / v6 Master", headColor:"text-orange", items:[
            { l:"Total Words", v:"243,218", vc:"text-orange" },
            { l:"Chapters",    v:"45",      vc:"text-orange" },
            { l:"Status",      v:"TRACKING BASELINE", vc:"text-orange", small:true },
          ]},
          { head:"◉ v16 Current Authoritative", headColor:"text-teal", items:[
            { l:"Total Words", v:"228,562", vc:"text-teal" },
            { l:"Chapters",    v:"42",      vc:"text-teal" },
            { l:"Status",      v:"ACTIVE · wc -w canonical", vc:"text-teal", small:true },
          ]},
          { head:"Δ DELTA", headColor:"text-gold", items:[
            { l:"Word delta",   v:"−14,656 (−6.0%)", vc:"text-gold" },
            { l:"Chapter delta",v:"−3 chapters",     vc:"text-gold" },
            { l:"Dup pairs",    v:"3 UNRESOLVED",    vc:"text-red",  small:true },
          ]},
        ].map((col, i) => (
          <div key={i} className={`bg-card p-4 ${i < 2 ? "border-r border-border" : ""}`}>
            <div className={`text-[8px] font-mono font-bold mb-3 ${col.headColor}`}>{col.head}</div>
            {col.items.map(item => (
              <div key={item.l} className="mb-2">
                <div className="text-[7.5px] font-mono text-muted-foreground">{item.l}</div>
                <div className={`font-mono font-bold mt-0.5 ${item.vc} ${item.small ? "text-[8px]" : "text-sm"}`}>{item.v}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Live KPIs */}
      <div>
        <div className="text-[7.5px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Live Data — Audit · Quarantine · Claims</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPI
            value={latestRun ? (auditComplete ? "DONE" : `${auditPct}%`) : "—"}
            label="Latest Audit"
            note={latestRun ? `${latestRun.processed_chapters ?? 0}/${latestRun.total_chapters ?? "?"} chapters` : "No run found"}
            color={auditComplete ? "text-teal" : "text-gold"}
          />
          <KPI
            value={openFlags.length}
            label="Open Quarantine Flags"
            note={`${critFlags.length} CRITICAL · ${highFlags.length} HIGH`}
            color={critFlags.length > 0 ? "text-red" : openFlags.length > 0 ? "text-orange" : "text-teal"}
          />
          <KPI
            value={pendingClaims.length}
            label="Pending Claims"
            note={`${blockerClaims.length} submission-blockers`}
            color={blockerClaims.length > 0 ? "text-red" : pendingClaims.length > 0 ? "text-gold" : "text-teal"}
          />
          <KPI
            value={claims.length ? `${verifyPct}%` : "—"}
            label="Claims Verified"
            note={`${verifiedClaims.length} of ${claims.length} total`}
            color={verifyPct >= 80 ? "text-teal" : verifyPct >= 50 ? "text-gold" : "text-red"}
          />
        </div>
      </div>

      {/* Open quarantine flags */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-secondary/40 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-mono font-bold text-foreground">OPEN QUARANTINE FLAGS</div>
            <div className="text-[7.5px] font-mono text-muted-foreground mt-0.5">Status = quarantined · sorted by severity</div>
          </div>
          <span className={`text-[8px] font-mono font-black px-2 py-0.5 rounded border ${openFlags.length > 0 ? "text-red border-red/30 bg-red/10" : "text-teal border-teal/30 bg-teal/10"}`}>
            {openFlags.length} open
          </span>
        </div>
        {openFlags.length === 0 ? (
          <div className="px-4 py-6 text-center text-[10px] text-teal font-mono">No open quarantine flags ✓</div>
        ) : (
          <div className="divide-y divide-border/40">
            {openFlags.slice(0, 10).map((f, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                <SevBadge sev={f.severity} />
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-mono font-bold text-foreground">Ch.{f.chapter_number} — {f.flag}</div>
                  {f.detail && <div className="text-[8.5px] text-muted-foreground mt-0.5 line-clamp-1">{f.detail}</div>}
                </div>
                <span className="text-[7px] font-mono text-muted-foreground/50 flex-shrink-0">{f.category}</span>
              </div>
            ))}
            {openFlags.length > 10 && (
              <div className="px-4 py-2 text-[8px] font-mono text-muted-foreground/50">
                + {openFlags.length - 10} more open flags
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pending claims */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-secondary/40 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-mono font-bold text-foreground">PENDING CLAIM VERIFICATIONS</div>
            <div className="text-[7.5px] font-mono text-muted-foreground mt-0.5">Unverified or needs-source</div>
          </div>
          <span className={`text-[8px] font-mono font-black px-2 py-0.5 rounded border ${blockerClaims.length > 0 ? "text-red border-red/30 bg-red/10" : "text-gold border-gold/30 bg-gold/10"}`}>
            {pendingClaims.length} pending
          </span>
        </div>
        {pendingClaims.length === 0 ? (
          <div className="px-4 py-6 text-center text-[10px] text-teal font-mono">All claims verified ✓</div>
        ) : (
          <div className="divide-y divide-border/40">
            {pendingClaims.slice(0, 8).map((c, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                <span className={`text-[7px] font-mono font-black px-1.5 py-0.5 rounded flex-shrink-0 ${
                  c.submission_blocker ? "bg-red/20 text-red border border-red/30" : "bg-secondary text-muted-foreground border border-border"
                }`}>
                  Ch.{c.chapter_number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-mono text-foreground line-clamp-1">{c.claim_text}</div>
                  <div className="text-[7.5px] text-muted-foreground mt-0.5 font-mono">{c.claim_type} · {c.verification_status}</div>
                </div>
                {c.submission_blocker && (
                  <span className="text-[7px] font-mono font-black text-red flex-shrink-0">BLOCKER</span>
                )}
              </div>
            ))}
            {pendingClaims.length > 8 && (
              <div className="px-4 py-2 text-[8px] font-mono text-muted-foreground/50">
                + {pendingClaims.length - 8} more pending claims
              </div>
            )}
          </div>
        )}
      </div>

      {/* Audit run detail */}
      {latestRun && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-secondary/40">
            <div className="text-[9px] font-mono font-bold text-foreground">LATEST AUDIT RUN</div>
            <div className="text-[7.5px] font-mono text-muted-foreground mt-0.5">Run ID: {latestRun.run_id}</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-0 divide-x divide-border">
            {[
              { l:"Status",    v:latestRun.status?.toUpperCase(), c: latestRun.status === "complete" ? "text-teal" : "text-gold" },
              { l:"Chapters",  v:`${latestRun.processed_chapters ?? "—"}/${latestRun.total_chapters ?? "—"}`, c:"text-foreground" },
              { l:"Total Words",v:(latestRun.total_words ?? 0).toLocaleString(), c:"text-foreground" },
              { l:"Bugs Found",v:latestRun.total_bugs ?? "—", c: (latestRun.total_bugs > 0) ? "text-red" : "text-teal" },
              { l:"Critical",  v:latestRun.critical_count ?? "—", c: (latestRun.critical_count > 0) ? "text-red" : "text-teal" },
            ].map(s => (
              <div key={s.l} className="px-4 py-3 text-center">
                <div className={`text-sm font-black font-mono ${s.c}`}>{s.v}</div>
                <div className="text-[7px] font-mono text-muted-foreground uppercase tracking-widest mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Release checklist */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-secondary/40">
          <div className="text-[9px] font-mono font-bold text-foreground">QUARANTINE RELEASE CHECKLIST</div>
          <div className="text-[7.5px] font-mono text-muted-foreground mt-0.5">All items must be resolved before v17 is promoted out of quarantine</div>
        </div>
        <div className="divide-y divide-border/30">
          {RELEASE_CHECKLIST.map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-2.5">
              <div className="w-3.5 h-3.5 rounded border border-border flex-shrink-0 mt-0.5" />
              <SevBadge sev={item.sev} />
              <span className="text-[9px] font-mono text-foreground/80 leading-snug">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}