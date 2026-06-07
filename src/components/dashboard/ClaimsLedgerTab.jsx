import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CLAIM_TYPES = ["historical-fact", "statistical", "legal", "cultural", "military", "biographical", "geographic"];
const SOURCE_TYPES = ["primary", "secondary", "oral-history", "government-record", "academic", "journalism", "archive"];
const STATUSES = ["verified", "partially-verified", "disputed", "unverified", "needs-source"];

const STATUS_COLORS = {
  "verified":           "text-teal bg-teal/10 border-teal/40",
  "partially-verified": "text-gold bg-gold/10 border-gold/40",
  "disputed":           "text-red bg-red/10 border-red/40",
  "unverified":         "text-muted-foreground bg-muted/30 border-border",
  "needs-source":       "text-orange bg-orange/10 border-orange/40",
};

const TYPE_COLORS = {
  "historical-fact": "text-blue",
  "statistical":     "text-purple",
  "legal":           "text-gold",
  "cultural":        "text-teal",
  "military":        "text-red",
  "biographical":    "text-orange",
  "geographic":      "text-cyan",
};

const EMPTY_FORM = {
  chapter_number: "",
  claim_text: "",
  claim_type: "historical-fact",
  source_title: "",
  source_url: "",
  source_type: "primary",
  verification_status: "unverified",
  notes: "",
  submission_blocker: false,
};

export default function ClaimsLedgerTab() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: claims = [], isLoading } = useQuery({
    queryKey: ["claims-ledger"],
    queryFn: () => base44.entities.ClaimsLedger.list("-created_date", 200),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing
      ? base44.entities.ClaimsLedger.update(editing.id, data)
      : base44.entities.ClaimsLedger.create(data),
    onSuccess: () => { qc.invalidateQueries(["claims-ledger"]); setShowForm(false); setEditing(null); setForm(EMPTY_FORM); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ClaimsLedger.delete(id),
    onSuccess: () => qc.invalidateQueries(["claims-ledger"]),
  });

  const filtered = claims.filter(c => {
    const statusOk = filter === "all" || c.verification_status === filter;
    const typeOk = typeFilter === "all" || c.claim_type === typeFilter;
    return statusOk && typeOk;
  });

  const stats = {
    total: claims.length,
    verified: claims.filter(c => c.verification_status === "verified").length,
    needsSource: claims.filter(c => c.verification_status === "needs-source").length,
    blockers: claims.filter(c => c.submission_blocker).length,
  };

  const openEdit = (claim) => {
    setEditing(claim);
    setForm({ ...claim });
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-teal/5 border border-teal/30 rounded-lg p-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="text-xl">📋</div>
          <div>
            <div className="text-sm font-black font-mono text-teal">CLAIMS LEDGER — Narrative Assertions → Primary Sources</div>
            <div className="text-[10px] text-muted-foreground font-sans mt-0.5">
              Track every factual assertion in the manuscript against verifiable primary sources. Source-backed claims = submission armor.
            </div>
          </div>
        </div>
        <button
          onClick={openNew}
          className="text-[9px] font-bold font-mono px-3 py-1.5 rounded border bg-teal/20 text-teal border-teal/40 hover:bg-teal/30 transition-all whitespace-nowrap"
        >
          + ADD CLAIM
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "TOTAL CLAIMS", value: stats.total, color: "text-foreground" },
          { label: "VERIFIED", value: stats.verified, color: "text-teal" },
          { label: "NEEDS SOURCE", value: stats.needsSource, color: "text-orange" },
          { label: "SUB. BLOCKERS", value: stats.blockers, color: "text-red" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-2xl font-black font-mono ${s.color}`}>{s.value}</div>
            <div className="text-[9px] font-bold font-mono text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="text-[9px] font-bold font-mono text-muted-foreground">STATUS:</div>
        {["all", ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-[9px] font-bold font-mono px-2 py-1 rounded border transition-all ${filter === s ? "bg-accent text-white border-accent" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {s.toUpperCase()}
          </button>
        ))}
        <div className="text-[9px] font-bold font-mono text-muted-foreground ml-3">TYPE:</div>
        {["all", ...CLAIM_TYPES].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`text-[9px] font-bold font-mono px-2 py-1 rounded border transition-all ${typeFilter === t ? "bg-accent text-white border-accent" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="text-[10px] font-black font-mono text-gold">{editing ? "EDIT CLAIM" : "NEW CLAIM"}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[9px] font-bold font-mono text-muted-foreground">CHAPTER #</label>
              <input type="number" value={form.chapter_number} onChange={e => setForm({...form, chapter_number: +e.target.value})}
                className="w-full mt-1 bg-background border border-border rounded px-2 py-1 text-[11px] font-mono text-foreground" />
            </div>
            <div>
              <label className="text-[9px] font-bold font-mono text-muted-foreground">TYPE</label>
              <select value={form.claim_type} onChange={e => setForm({...form, claim_type: e.target.value})}
                className="w-full mt-1 bg-background border border-border rounded px-2 py-1 text-[11px] font-mono text-foreground">
                {CLAIM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold font-mono text-muted-foreground">SOURCE TYPE</label>
              <select value={form.source_type} onChange={e => setForm({...form, source_type: e.target.value})}
                className="w-full mt-1 bg-background border border-border rounded px-2 py-1 text-[11px] font-mono text-foreground">
                {SOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold font-mono text-muted-foreground">STATUS</label>
              <select value={form.verification_status} onChange={e => setForm({...form, verification_status: e.target.value})}
                className="w-full mt-1 bg-background border border-border rounded px-2 py-1 text-[11px] font-mono text-foreground">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[9px] font-bold font-mono text-muted-foreground">CLAIM / ASSERTION</label>
            <textarea value={form.claim_text} onChange={e => setForm({...form, claim_text: e.target.value})} rows={2}
              className="w-full mt-1 bg-background border border-border rounded px-2 py-1 text-[11px] font-sans text-foreground resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-bold font-mono text-muted-foreground">SOURCE TITLE</label>
              <input type="text" value={form.source_title} onChange={e => setForm({...form, source_title: e.target.value})}
                className="w-full mt-1 bg-background border border-border rounded px-2 py-1 text-[11px] font-sans text-foreground" />
            </div>
            <div>
              <label className="text-[9px] font-bold font-mono text-muted-foreground">SOURCE URL</label>
              <input type="text" value={form.source_url} onChange={e => setForm({...form, source_url: e.target.value})}
                className="w-full mt-1 bg-background border border-border rounded px-2 py-1 text-[11px] font-sans text-foreground" />
            </div>
          </div>
          <div>
            <label className="text-[9px] font-bold font-mono text-muted-foreground">NOTES</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2}
              className="w-full mt-1 bg-background border border-border rounded px-2 py-1 text-[11px] font-sans text-foreground resize-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.submission_blocker} onChange={e => setForm({...form, submission_blocker: e.target.checked})} id="sb" />
            <label htmlFor="sb" className="text-[10px] font-bold font-mono text-red">Submission Blocker</label>
          </div>
          <div className="flex gap-2">
            <button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}
              className="text-[9px] font-bold font-mono px-4 py-1.5 rounded bg-teal/20 text-teal border border-teal/40 hover:bg-teal/30 transition-all disabled:opacity-50">
              {saveMutation.isPending ? "SAVING…" : "SAVE"}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }}
              className="text-[9px] font-bold font-mono px-4 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground transition-all">
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="text-center text-muted-foreground text-[11px] font-mono py-8">Loading claims…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted-foreground text-[11px] font-mono py-8 border border-dashed border-border rounded-lg">
          No claims yet. Add the first entry from the manuscript.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => (
            <div key={c.id} className={`bg-card border rounded-lg p-3 ${c.submission_blocker ? "border-red/50" : "border-border"}`}>
              <div className="flex items-start gap-3">
                <div className="text-[10px] font-black font-mono text-muted-foreground w-8 flex-shrink-0 pt-0.5">Ch.{c.chapter_number}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold font-mono ${TYPE_COLORS[c.claim_type] || "text-foreground"}`}>{c.claim_type?.toUpperCase()}</span>
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${STATUS_COLORS[c.verification_status]}`}>{c.verification_status}</span>
                    {c.submission_blocker && <span className="text-[9px] font-bold font-mono text-red">⚠ BLOCKER</span>}
                    {c.source_type && <span className="text-[9px] font-mono text-muted-foreground">[{c.source_type}]</span>}
                  </div>
                  <div className="text-[11px] font-sans text-foreground leading-snug mb-1">{c.claim_text}</div>
                  {c.source_title && (
                    <div className="text-[10px] font-sans text-muted-foreground">
                      <span className="text-gold font-bold">SOURCE: </span>
                      {c.source_url
                        ? <a href={c.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">{c.source_title}</a>
                        : c.source_title}
                    </div>
                  )}
                  {c.notes && <div className="text-[10px] font-sans text-muted-foreground/70 mt-0.5 italic">{c.notes}</div>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(c)} className="text-[9px] font-mono text-muted-foreground hover:text-gold px-1.5 py-0.5 rounded border border-border hover:border-gold/40 transition-all">EDIT</button>
                  <button onClick={() => { if (confirm("Delete this claim?")) deleteMutation.mutate(c.id); }} className="text-[9px] font-mono text-muted-foreground hover:text-red px-1.5 py-0.5 rounded border border-border hover:border-red/40 transition-all">DEL</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}