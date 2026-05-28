/**
 * LitCentral v13 - External Sources Registry
 * Manages connections to academic and reference APIs
 * Includes: Crossref, Open Library, Google Books, LoC, Semantic Scholar, TMDB
 */

export const EXTERNAL_SOURCES = {
  CROSSREF: {
    id: "crossref",
    name: "Crossref",
    endpoint: "https://api.crossref.org/v1",
    rateLimit: { requests: 50, window: 1000 }, // 50 req/sec
    userAgent: "LitCentral/13.0 (research; +https://litcentral.ai)",
    capabilities: ["metadata_lookup", "doi_resolution", "citation_data"],
    auth: "none",
    enabled: true
  },
  OPEN_LIBRARY: {
    id: "open_library",
    name: "Open Library",
    endpoint: "https://openlibrary.org/api",
    rateLimit: { requests: 10, window: 1000 }, // 10 req/sec
    userAgent: "LitCentral/13.0 (research; +https://litcentral.ai)",
    capabilities: ["isbn_lookup", "work_metadata", "edition_data"],
    auth: "none",
    enabled: true
  },
  GOOGLE_BOOKS: {
    id: "google_books",
    name: "Google Books",
    endpoint: "https://www.googleapis.com/books/v1",
    rateLimit: { requests: 100, window: 1000 }, // 100 req/sec (with key)
    userAgent: "LitCentral/13.0 (research; +https://litcentral.ai)",
    capabilities: ["isbn_lookup", "full_title_search", "preview_link"],
    auth: "api_key",
    enabled: true,
    configKey: "GOOGLE_BOOKS_API_KEY"
  },
  LOC: {
    id: "loc",
    name: "Library of Congress",
    endpoint: "https://www.loc.gov/bibframe",
    rateLimit: { requests: 25, window: 1000 }, // 25 req/sec
    userAgent: "LitCentral/13.0 (research; +https://litcentral.ai)",
    // BIBFRAME v3.1 (March 2026) — BCP47 language + script codes are now
    // round-tripped through MARC's $7 data-provenance subfield. The submission
    // pipeline must emit BCP47 for every distinct language in the manuscript.
    // See docs/audit/BIBFRAME_v3.1_briefing.md
    capabilities: [
      "lccn_lookup",
      "control_numbers",
      "authority_records",
      "bibframe_v3.1",
      "bcp47_provenance",
    ],
    conversionSpec: {
      version: "3.1",
      marc2bibframe: "https://github.com/lcnetdev/marc2bibframe2",
      bibframe2marc: "https://github.com/lcnetdev/bibframe2marc",
      modernMarc: "https://www.loc.gov/marc/ModernMARC-March2026.pdf",
      announcement: "https://www.loc.gov/bibframe/implementation/index.html",
    },
    auth: "none",
    enabled: true,
  },
  SEMANTIC_SCHOLAR: {
    id: "semantic_scholar",
    name: "Semantic Scholar",
    endpoint: "https://api.semanticscholar.org/graph/v1",
    rateLimit: { requests: 10, window: 1000 }, // 10 req/sec
    userAgent: "LitCentral/13.0 (research; +https://litcentral.ai)",
    capabilities: ["paper_search", "citation_graph", "author_data"],
    auth: "api_key",
    enabled: true,
    configKey: "SEMANTIC_SCHOLAR_API_KEY"
  },
  TMDB: {
    id: "tmdb",
    name: "The Movie Database",
    endpoint: "https://api.themoviedb.org/3",
    rateLimit: { requests: 40, window: 1000 }, // 40 req/sec
    userAgent: "LitCentral/13.0 (research; +https://litcentral.ai)",
    capabilities: ["film_metadata", "cast_crew", "external_ids"],
    auth: "api_key",
    enabled: true,
    configKey: "TMDB_API_KEY"
  }
};

export const DATA_SOURCE_REGISTRY = [
  {
    source_id: "crossref",
    status: "active",
    last_sync: "2026-05-25T00:00:00Z",
    documents_indexed: 156_000_000,
    coverage: "global",
    update_frequency: "daily"
  },
  {
    source_id: "open_library",
    status: "active",
    last_sync: "2026-05-25T00:00:00Z",
    documents_indexed: 1_700_000,
    coverage: "global",
    update_frequency: "weekly"
  },
  {
    source_id: "google_books",
    status: "active",
    last_sync: "2026-05-25T00:00:00Z",
    documents_indexed: 40_000_000,
    coverage: "global",
    update_frequency: "real-time"
  },
  {
    source_id: "loc",
    status: "active",
    last_sync: "2026-05-25T00:00:00Z",
    documents_indexed: 17_000_000,
    coverage: "US",
    update_frequency: "daily"
  },
  {
    source_id: "semantic_scholar",
    status: "active",
    last_sync: "2026-05-25T00:00:00Z",
    documents_indexed: 200_000_000,
    coverage: "global",
    update_frequency: "real-time"
  },
  {
    source_id: "tmdb",
    status: "active",
    last_sync: "2026-05-25T00:00:00Z",
    documents_indexed: 1_000_000,
    coverage: "global",
    update_frequency: "daily"
  }
];

export const getSourceConfig = (sourceId) => {
  return Object.values(EXTERNAL_SOURCES).find(s => s.id === sourceId) || null;
};

export const isSourceEnabled = (sourceId) => {
  const config = getSourceConfig(sourceId);
  return config && config.enabled;
};

export default {
  EXTERNAL_SOURCES,
  DATA_SOURCE_REGISTRY,
  getSourceConfig,
  isSourceEnabled
};
