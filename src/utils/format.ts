import type { TranscriptEntry, SearchResult } from "../transcript.ts";

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatSrtTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

export function formatPlain(entries: TranscriptEntry[]): string {
  return entries.map((e) => e.text).join("\n");
}

export function formatTimestamped(entries: TranscriptEntry[]): string {
  return entries
    .map((e) => `[${formatTimestamp(e.start)}] ${e.text}`)
    .join("\n");
}

export function formatJson(entries: TranscriptEntry[]): string {
  return JSON.stringify(entries, null, 2);
}

export function formatMarkdown(entries: TranscriptEntry[]): string {
  const chunks: string[] = [];
  let chunkStart = 0;
  let chunkLines: string[] = [];

  for (const entry of entries) {
    if (entry.start - chunkStart >= 30 && chunkLines.length > 0) {
      chunks.push(`## [${formatTimestamp(chunkStart)}]\n\n${chunkLines.join(" ")}`);
      chunkLines = [];
      chunkStart = entry.start;
    }
    if (chunkLines.length === 0) chunkStart = entry.start;
    chunkLines.push(entry.text);
  }

  if (chunkLines.length > 0) {
    chunks.push(`## [${formatTimestamp(chunkStart)}]\n\n${chunkLines.join(" ")}`);
  }

  return chunks.join("\n\n");
}

export function formatSrt(entries: TranscriptEntry[]): string {
  return entries
    .map((e, i) => {
      const start = formatSrtTimestamp(e.start);
      const end = formatSrtTimestamp(e.start + e.duration);
      return `${i + 1}\n${start} --> ${end}\n${e.text}`;
    })
    .join("\n\n");
}

export function formatSearchResults(results: SearchResult[], query: string): string {
  if (results.length === 0) return `No matches found for "${query}".`;

  return results
    .map((r) => {
      const ts = formatTimestamp(r.entry.start);
      const contextText = r.context.map((c) => c.text).join(" ");
      return `[${ts}] ${contextText}`;
    })
    .join("\n\n");
}

export function formatSearchResultsJson(results: SearchResult[]): string {
  return JSON.stringify(
    results.map((r) => ({
      timestamp: r.entry.start,
      match: r.entry.text,
      context: r.context.map((c) => ({ text: c.text, start: c.start })),
    })),
    null,
    2
  );
}
