import DashCard from "./DashCard";
import { ExternalLink, Database, AlertTriangle, CheckCircle, Clock, Lock } from "lucide-react";

const ACCESS_COLOR = { public:"text-teal", enterprise:"text-red", controlled:"text-gold", restricted:"text-orange", scrape:"text-blue" };
const COST_COLOR   = { free:"text-teal", expensive:"text-red", medium:"text-gold", low:"text-blue", "very high":"text-red" };
const REL_COLOR    = { high:"text-teal", "extremely high":"text-cyan", medium:"text-gold", low:"text-orange" };

const SOURCES = [
  { n:1,  label:"Pulitzer Prize Archive",          domain:"Literary / Award",  api:"Scrape (structured archive)", access:"scrape",     cost:"free",      reliability:"high",         useCase:"Prestige language clustering · Award probability baseline",    url:"https://www.pulitzer.org/prize-winners-by-year" },
  { n:2,  label:"National Book Award",             domain:"Literary / Award",  api:"Scrape / NBF site",           access:"scrape",     cost:"free",      reliability:"high",         useCase:"Institutional preference map · Literary prestige classifier",   url:"https://www.nationalbook.org/national-book-awards/" },
  { n:3,  label:"Goodreads (Kaggle / RapidAPI)",   domain:"Reader Sentiment",  api:"Kaggle dump / RapidAPI",      access:"scrape",     cost:"low",       reliability:"medium",       useCase:"Reader fatigue modeling · Abandonment + reread signals",        url:"https://www.kaggle.com/datasets/jealousleopard/goodreadsbooks" },
  { n:4,  label:"Open Library",                    domain:"Metadata / Canon",  api:"REST API (public)",           access:"public",     cost:"free",      reliability:"high",         useCase:"Canonization persistence · Classification trends",              url:"https://openlibrary.org/developers/api" },
  { n:5,  label:"Library of Congress",             domain:"Metadata / Canon",  api:"LOC API (public)",            access:"public",     cost:"free",      reliability:"high",         useCase:"Historical reference density · Archival trends",                url:"https://api.loc.gov/" },
  { n:6,  label:"HathiTrust Research Center",      domain:"Corpus Linguistics", api:"HTRC Feature Reader",        access:"controlled", cost:"free",      reliability:"high",         useCase:"Lexical density comparison · Historical narrative drift",       url:"https://analytics.hathitrust.org/" },
  { n:7,  label:"Crossref API",                    domain:"Academic / Citation",api:"REST API (public)",          access:"public",     cost:"free",      reliability:"high",         useCase:"Citation longevity · Scholarly survival scoring",               url:"https://api.crossref.org/" },
  { n:8,  label:"Semantic Scholar",                domain:"Academic / Citation",api:"REST API (public)",          access:"public",     cost:"free",      reliability:"high",         useCase:"Chicano literary criticism · Trauma theory papers",             url:"https://api.semanticscholar.org/" },
  { n:9,  label:"MLA International Bibliography",  domain:"Academic / Literary",api:"Institutional access",      access:"enterprise", cost:"medium",    reliability:"high",         useCase:"Academic discourse probability · MLA keyword frequency",        url:"https://www.mla.org/Publications/MLA-International-Bibliography" },
  { n:10, label:"Nielsen / Latino Donor Collab.",  domain:"Market Intelligence",api:"PDF / Manual / Reports",    access:"enterprise", cost:"expensive", reliability:"high",         useCase:"Hispanic market pressure model · Bilingual engagement",         url:"https://latinodonorcollaborative.org/ldc-reports/" },
  { n:11, label:"Circana BookScan",                domain:"Market / Sales",    api:"Enterprise only",             access:"restricted", cost:"very high", reliability:"extremely high",useCase:"Comp-title sales curves · Acquisition probability modeling",    url:"https://circana.com/intelligence/books/" },
  { n:12, label:"Kaggle Datasets",                 domain:"ML / NLP",          api:"Kaggle API",                  access:"public",     cost:"free",      reliability:"medium",       useCase:"Goodreads dumps · Bestseller NLP corpora · Sentiment models",  url:"https://www.kaggle.com/datasets" },
  { n:13, label:"Google Books API",                domain:"Metadata / Market", api:"Google Books API",            access:"public",     cost:"free",      reliability:"high",         useCase:"Publication histories · Recommendation relationships",          url:"https://developers.google.com/books" },
  { n:14, label:"Internet Archive",                domain:"Historical / FOIA", api:"Archive.org API",             access:"public",     cost:"free",      reliability:"high",         useCase:"Vietnam texts · Chicano archives · Military records · Oral histories", url:"https://archive.org/developers" },
  { n:15, label:"WorldCat / OCLC",                 domain:"Canonization",      api:"WorldCat Search API",         access:"controlled", cost:"medium",    reliability:"high",         useCase:"Library holdings · Academic institutional adoption tracking",   url:"https://www.oclc.org/en/worldcat/webservices.html" },
  { n:16, label:"TMDB / IMDb",                     domain:"Adaptation / Screen",api:"TMDB REST API",             access:"public",     cost:"free",      reliability:"high",         useCase:"Adaptation viability · Latino streaming analysis",              url:"https://developers.themoviedb.org/3" },
  { n:17, label:"Reddit API",                      domain:"Social / Cultural", api:"Reddit REST API",             access:"public",     cost:"free",      reliability:"medium",       useCase:"Chicano discourse · Deported veteran threads · PTSD signals",  url:"https://www.reddit.com/dev/api/" },
  { n:18, label:"YouTube Data API",                domain:"Social / Cultural", api:"YouTube Data API v3",         access:"public",     cost:"free",      reliability:"high",         useCase:"Military-drama engagement · Bilingual content behavior",        url:"https://developers.google.com/youtube/v3" },
  { n:19, label:"JSTOR",                           domain:"Academic",          api:"JSTOR Data for Research",     access:"controlled", cost:"free",      reliability:"high",         useCase:"Vietnam war scholarship · Postcolonial / ethnic studies",       url:"https://www.jstor.org/dfr/" },
  { n:20, label:"TikTok Research API",             domain:"Social / Cultural", api:"TikTok Research API",         access:"controlled", cost:"free",      reliability:"medium",       useCase:"LiveCultural Sentiment Engine · Symbolic language tracking",    url:"https://developers.tiktok.com/doc/research-api-intro" },
];

const STACK = [
  { layer:"Raw Ingestion",    tool:"Airbyte / Meltano",         color:"blue",   note:"ELT pipelines from all source APIs" },
  { layer:"Queueing",         tool:"Kafka / RabbitMQ",          color:"orange", note:"Event streaming between pipeline stages" },
  { layer:"Warehouse",        tool:"PostgreSQL + ElasticSearch", color:"teal",  note:"Structured data + full-text search layer" },
  { layer:"Vectors",          tool:"Weaviate / Pinecone",        color:"purple", note:"Semantic embedding for literary comparisons" },
  { layer:"Graph",            tool:"Neo4j",                      color:"gold",   note:"Character arcs, citation networks, influence maps" },
  { layer:"Analytics",        tool:"SPSS / Python / R",          color:"cyan",   note:"Regression · ANOVA · literary scoring models" },
  { layer:"AI Orchestration", tool:"Claude + OpenAI",            color:"blue",   note:"LLM reasoning across all engine layers" },
  { layer:"Search",           tool:"OpenSearch",                 color:"orange", note:"Full-text literary corpus search" },
  { layer:"Dashboard",        tool:"React + D3 (LITCENTRAL)",    color:"gold",   note:"This interface" },
  { layer:"API Layer",        tool:"FastAPI",                    color:"teal",   note:"Unified endpoint serving all engines" },
];

const STATUS_COUNTS = {
  wired: SOURCES.filter(s => s.access === "public").length,
  needsEnterprise: SOURCES.filter(s => s.access === "enterprise" || s.access === "restricted").length,
  scrape: SOURCES.filter(s => s.access === "scrape").length,
  controlled: SOURCES.filter(s => s.access === "controlled").length,
};

export default function DataIntelTab() {
  return (
    <div className="animate-slide-up space-y-4">
      {/* Header */}
      <div className="bg-blue/5 border border-blue/30 rounded-lg p-4">
        <div className="text-sm font-bold text-blue font-mono">
          LITCENTRAL DATA INTELLIGENCE REGISTRY — v1.0 · 2026-05-23
        </div>
        <div className="text-xs text-foreground/60 font-sans mt-1 leading-relaxed">
          20 identified data sources · Infrastructure blueprint for TruthEngine360 + NOVIL + Canon Guard · Source map → spine of the Publishing Pressure Engine and Scholarly Survival Engine
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label:"Public API", value: STATUS_COUNTS.wired,          color:"text-teal",   desc:"Wire immediately" },
          { label:"Scrape",     value: STATUS_COUNTS.scrape,          color:"text-blue",   desc:"Unstable but accessible" },
          { label:"Controlled", value: STATUS_COUNTS.controlled,      color:"text-gold",   desc:"Institutional access needed" },
          { label:"Enterprise", value: STATUS_COUNTS.needsEnterprise,  color:"text-red",    desc:"Commercial / restricted" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-2xl font-black font-mono ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-foreground font-bold font-mono">{s.label}</div>
            <div className="text-[9px] text-muted-foreground">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Source Map Table */}
      <DashCard title="Literary Intelligence Database Registry — 20 Sources · Full Source Map" accent="blue">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 pr-2 font-bold w-6">#</th>
                <th className="text-left py-2 pr-3 font-bold">Source</th>
                <th className="text-left py-2 pr-3 font-bold">Domain</th>
                <th className="text-left py-2 pr-3 font-bold">API / Method</th>
                <th className="text-left py-2 pr-2 font-bold">Access</th>
                <th className="text-left py-2 pr-2 font-bold">Cost</th>
                <th className="text-left py-2 pr-2 font-bold">Reliability</th>
                <th className="text-left py-2 font-bold">Use Case</th>
                <th className="text-center py-2 pl-2 font-bold w-8">↗</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map(s => (
                <tr key={s.n} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                  <td className="py-2 pr-2 text-muted-foreground font-bold">{s.n}</td>
                  <td className="py-2 pr-3 text-foreground font-bold max-w-[160px]">{s.label}</td>
                  <td className="py-2 pr-3 text-muted-foreground text-[10px]">{s.domain}</td>
                  <td className="py-2 pr-3 text-muted-foreground text-[10px]">{s.api}</td>
                  <td className={`py-2 pr-2 font-bold capitalize ${ACCESS_COLOR[s.access] || "text-foreground"}`}>{s.access}</td>
                  <td className={`py-2 pr-2 capitalize ${COST_COLOR[s.cost] || "text-foreground"}`}>{s.cost}</td>
                  <td className={`py-2 pr-2 capitalize ${REL_COLOR[s.reliability] || "text-foreground"}`}>{s.reliability}</td>
                  <td className="py-2 text-muted-foreground text-[10px] max-w-[240px]">{s.useCase}</td>
                  <td className="py-2 pl-2 text-center">
                    <a href={s.url} target="_blank" rel="noopener noreferrer"
                       className="text-blue/60 hover:text-blue transition-colors">
                      <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashCard>

      {/* Architecture Stack */}
      <DashCard title="Target Data Warehouse Architecture — TruthEngine360 Infrastructure" accent="purple">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {STACK.map(s => (
            <div key={s.layer} className="flex items-start gap-3 p-2.5 rounded-md bg-background border border-border">
              <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 bg-${s.color}`} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wider">{s.layer}</span>
                </div>
                <div className={`text-xs font-bold font-mono text-${s.color}`}>{s.tool}</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-0.5">{s.note}</div>
              </div>
            </div>
          ))}
        </div>
      </DashCard>

      {/* Priority Wiring */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashCard title="Wire Immediately — Public API · Free" accent="teal">
          <div className="space-y-1.5">
            {SOURCES.filter(s => s.access === "public" && s.cost === "free").map(s => (
              <div key={s.n} className="flex items-center justify-between py-1.5 px-2 rounded bg-teal/5 border border-teal/20">
                <div>
                  <div className="text-xs font-bold text-foreground font-mono">{s.label}</div>
                  <div className="text-[9px] text-muted-foreground">{s.domain}</div>
                </div>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 text-teal/60 hover:text-teal" />
                </a>
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard title="Priority Scrape / Controlled — Build Around" accent="gold">
          <div className="space-y-1.5">
            {SOURCES.filter(s => s.access === "scrape" || s.access === "controlled").map(s => (
              <div key={s.n} className="flex items-center justify-between py-1.5 px-2 rounded bg-gold/5 border border-gold/20">
                <div>
                  <div className="text-xs font-bold text-foreground font-mono">{s.label}</div>
                  <div className="text-[9px] text-muted-foreground">{s.access} · {s.domain}</div>
                </div>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 text-gold/60 hover:text-gold" />
                </a>
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard title="Enterprise / Restricted — Budget Required" accent="red">
          <div className="space-y-1.5">
            {SOURCES.filter(s => s.access === "enterprise" || s.access === "restricted").map(s => (
              <div key={s.n} className="flex items-center justify-between py-1.5 px-2 rounded bg-red/5 border border-red/20">
                <div>
                  <div className="text-xs font-bold text-foreground font-mono">{s.label}</div>
                  <div className="text-[9px] text-muted-foreground">cost: {s.cost} · {s.domain}</div>
                </div>
                <Lock className="w-3 h-3 text-red/60" />
              </div>
            ))}
          </div>
        </DashCard>
      </div>

      {/* Critical Next Step */}
      <div className="bg-gold/5 border border-gold/30 rounded-lg p-4">
        <div className="text-sm font-bold text-gold font-mono mb-2">CRITICAL NEXT STEP — Build the Source Registry as Live Database</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans text-foreground/80">
          <div className="space-y-1">
            <div className="font-bold text-teal font-mono text-[10px]">PHASE 1 — Wire Public APIs</div>
            <div>Crossref · Semantic Scholar · Open Library · LOC · Google Books · TMDB · Reddit · YouTube → ingest metadata → PostgreSQL</div>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-gold font-mono text-[10px]">PHASE 2 — Scrape + Corpus</div>
            <div>Pulitzer / NBA archives → structured JSON · HathiTrust Feature Reader → lexical density baseline · Goodreads Kaggle → reader sentiment model</div>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-red font-mono text-[10px]">PHASE 3 — Enterprise Access</div>
            <div>Nielsen/LDC reports → market model · MLA Bibliography → academic discourse probability · BookScan → comp-title sales curves (requires commercial license)</div>
          </div>
        </div>
      </div>
    </div>
  );
}