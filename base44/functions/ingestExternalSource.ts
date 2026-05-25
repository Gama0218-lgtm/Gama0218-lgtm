/**
 * base44/functions/ingestExternalSource/entry.ts
 * LitCentral v13 - External Source Ingestion
 * 
 * Six API adapters: Crossref, Open Library, Google Books, LoC, Semantic Scholar, TMDB
 * Fetches comparative corpus for audit enrichment and citation verification
 * 
 * Input:
 * - manuscript_id (UUID)
 * - source_id (string: crossref, open_library, google_books, loc, semantic_scholar, tmdb)
 * - query (string or object with search parameters)
 * 
 * Output:
 * - external_works array with metadata from selected source
 */

import { z } from "zod";

const SOURCES = {
  crossref: {
    endpoint: "https://api.crossref.org/v1",
    rateLimit: 50, // requests per second
    auth: "none"
  },
  open_library: {
    endpoint: "https://openlibrary.org/api",
    rateLimit: 10,
    auth: "none"
  },
  google_books: {
    endpoint: "https://www.googleapis.com/books/v1",
    rateLimit: 100,
    auth: "api_key"
  },
  loc: {
    endpoint: "https://www.loc.gov/bibframe",
    rateLimit: 25,
    auth: "none"
  },
  semantic_scholar: {
    endpoint: "https://api.semanticscholar.org/graph/v1",
    rateLimit: 10,
    auth: "api_key"
  },
  tmdb: {
    endpoint: "https://api.themoviedb.org/3",
    rateLimit: 40,
    auth: "api_key"
  }
};

export const req = z.object({
  manuscript_id: z.string().uuid(),
  source_id: z.enum(["crossref", "open_library", "google_books", "loc", "semantic_scholar", "tmdb"]),
  query: z.string().or(z.object({})).default("")
});

export async function run(req: z.infer<typeof req>, modules: any) {
  const { db, http } = modules;
  
  console.log(`[INGEST] Fetching from ${req.source_id} for manuscript: ${req.manuscript_id}`);
  
  // Update data source registry status
  await db.update(
    "data_source_registry",
    { source_id: req.source_id },
    { status: "active", last_sync_at: new Date().toISOString() }
  );
  
  let results = [];
  
  try {
    switch (req.source_id) {
      case "crossref":
        results = await ingestCrossref(req.query, http);
        break;
      case "open_library":
        results = await ingestOpenLibrary(req.query, http);
        break;
      case "google_books":
        results = await ingestGoogleBooks(req.query, http, modules.env);
        break;
      case "loc":
        results = await ingestLOC(req.query, http);
        break;
      case "semantic_scholar":
        results = await ingestSemanticScholar(req.query, http, modules.env);
        break;
      case "tmdb":
        results = await ingestTMDB(req.query, http, modules.env);
        break;
    }
    
    // Store results in database
    for (const work of results) {
      const workId = generateUUID();
      await db.insert("external_works", {
        work_id: workId,
        manuscript_id: req.manuscript_id,
        source_id: req.source_id,
        external_id: work.external_id || "",
        title: work.title || "",
        authors: JSON.stringify(work.authors || []),
        published_year: work.published_year,
        publication_venue: work.publication_venue,
        work_type: work.work_type || "other",
        cited_in_manuscript: false,
        relevance_score: work.relevance_score || 0.0,
        abstract: work.abstract,
        url: work.url,
        metadata: JSON.stringify(work.metadata || {}),
        synced_at: new Date().toISOString()
      });
    }
    
    // Update registry with success
    await db.update(
      "data_source_registry",
      { source_id: req.source_id },
      {
        last_sync_status: "success",
        sync_attempts_total: db.raw("sync_attempts_total + 1"),
        last_error_message: null
      }
    );
    
    console.log(`[INGEST] ✓ Ingested ${results.length} works from ${req.source_id}`);
    
    return {
      success: true,
      source_id: req.source_id,
      ingested_count: results.length,
      works: results
    };
  } catch (error) {
    console.error(`[INGEST] ✗ Error ingesting from ${req.source_id}: ${error.message}`);
    
    await db.update(
      "data_source_registry",
      { source_id: req.source_id },
      {
        last_sync_status: "failed",
        sync_attempts_total: db.raw("sync_attempts_total + 1"),
        sync_attempts_failed: db.raw("sync_attempts_failed + 1"),
        last_error_message: error.message
      }
    );
    
    return {
      success: false,
      source_id: req.source_id,
      error: error.message
    };
  }
}

async function ingestCrossref(query: string, http: any): Promise<any[]> {
  const response = await http.get(`https://api.crossref.org/v1/works?query=${encodeURIComponent(query)}&rows=10`, {
    headers: { "User-Agent": "LitCentral/13.0 (research; +https://litcentral.ai)" }
  });
  
  const works = response.data?.message?.items || [];
  return works.map((item: any) => ({
    external_id: item.DOI,
    title: item.title?.[0] || "",
    authors: (item.author || []).map((a: any) => ({ name: `${a.given} ${a.family}` })),
    published_year: item.published?.["date-parts"]?.[0]?.[0],
    publication_venue: item.["container-title"]?.[0],
    work_type: "journal_article",
    url: item.URL,
    metadata: item
  }));
}

async function ingestOpenLibrary(query: string, http: any): Promise<any[]> {
  const response = await http.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=10`);
  
  const books = response.data?.docs || [];
  return books.map((book: any) => ({
    external_id: book.key,
    title: book.title || "",
    authors: (book.author_name || []).map((name: string) => ({ name })),
    published_year: book.first_publish_year,
    work_type: "book",
    url: `https://openlibrary.org${book.key}`,
    metadata: book
  }));
}

async function ingestGoogleBooks(query: string, http: any, env: any): Promise<any[]> {
  const apiKey = env.GOOGLE_BOOKS_API_KEY || "";
  const response = await http.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=10`);
  
  const items = response.data?.items || [];
  return items.map((item: any) => ({
    external_id: item.id,
    title: item.volumeInfo?.title || "",
    authors: item.volumeInfo?.authors || [],
    published_year: parseInt(item.volumeInfo?.publishedDate?.split("-")?.[0] || "0"),
    publication_venue: item.volumeInfo?.publisher,
    work_type: "book",
    url: item.volumeInfo?.previewLink,
    metadata: item.volumeInfo
  }));
}

async function ingestLOC(query: string, http: any): Promise<any[]> {
  const response = await http.get(`https://www.loc.gov/cgi-bin/bibframe?search=${encodeURIComponent(query)}&format=json`);
  const records = response.data?.records || [];
  
  return records.map((record: any) => ({
    external_id: record.id,
    title: record.title || "",
    authors: record.creator || [],
    published_year: record.date,
    work_type: "other",
    metadata: record
  }));
}

async function ingestSemanticScholar(query: string, http: any, env: any): Promise<any[]> {
  const apiKey = env.SEMANTIC_SCHOLAR_API_KEY || "";
  const response = await http.get(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=10`, {
    headers: { "x-api-key": apiKey }
  });
  
  const papers = response.data?.data || [];
  return papers.map((paper: any) => ({
    external_id: paper.paperId,
    title: paper.title || "",
    authors: (paper.authors || []).map((a: any) => ({ name: a.name })),
    published_year: paper.year,
    publication_venue: paper.venue,
    work_type: "journal_article",
    url: paper.url,
    metadata: paper
  }));
}

async function ingestTMDB(query: string, http: any, env: any): Promise<any[]> {
  const apiKey = env.TMDB_API_KEY || "";
  const response = await http.get(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${apiKey}`);
  
  const results = response.data?.results || [];
  return results.map((item: any) => ({
    external_id: item.id,
    title: item.title || item.name || "",
    authors: [], 
    published_year: item.release_date ? parseInt(item.release_date.split("-")[0]) : null,
    work_type: item.media_type === "movie" ? "film" : "other",
    metadata: item
  }));
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
