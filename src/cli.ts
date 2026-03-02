#!/usr/bin/env node

import { parseArgs, printHelp } from "./utils/args.ts";
import {
  formatPlain,
  formatTimestamped,
  formatJson,
  formatMarkdown,
  formatSrt,
  formatSearchResults,
  formatSearchResultsJson,
} from "./utils/format.ts";
import {
  extractVideoId,
  getTranscript,
  searchTranscript,
  clipTranscript,
  parseTimestamp,
} from "./transcript.ts";
import type { TranscriptEntry } from "./transcript.ts";
import { readStdinUrls } from "./stdin.ts";

function formatOutput(entries: TranscriptEntry[], options: ReturnType<typeof parseArgs>): string {
  if (options.json) return formatJson(entries);
  if (options.md) return formatMarkdown(entries);
  if (options.srt) return formatSrt(entries);
  if (options.timestamps) return formatTimestamped(entries);
  return formatPlain(entries);
}

function resolveVideoId(input: string): string {
  const id = extractVideoId(input);
  if (!id) {
    throw new Error(`Could not extract video ID from "${input}"`);
  }
  return id;
}

async function handleTranscript(url: string, options: ReturnType<typeof parseArgs>): Promise<string> {
  const videoId = resolveVideoId(url);
  const entries = await getTranscript(videoId, options.lang);
  return formatOutput(entries, options);
}

async function handleSearch(url: string, query: string, options: ReturnType<typeof parseArgs>): Promise<string> {
  const videoId = resolveVideoId(url);
  const entries = await getTranscript(videoId, options.lang);
  const results = searchTranscript(entries, query);

  if (options.json) {
    return formatSearchResultsJson(results);
  } else {
    return formatSearchResults(results, query);
  }
}

async function handleClip(url: string, options: ReturnType<typeof parseArgs>): Promise<string> {
  if (!options.from) {
    throw new Error("--from is required for clip command");
  }

  const videoId = resolveVideoId(url);
  const entries = await getTranscript(videoId, options.lang);

  const fromSec = parseTimestamp(options.from);
  const lastEntry = entries[entries.length - 1];
  const toSec = options.to
    ? parseTimestamp(options.to)
    : lastEntry ? lastEntry.start + lastEntry.duration : fromSec;

  const clipped = clipTranscript(entries, fromSec, toSec);
  return formatOutput(clipped, options);
}

async function processUrl(url: string, options: ReturnType<typeof parseArgs>): Promise<string> {
  switch (options.command) {
    case "search":
      return handleSearch(url, options.query!, options);
    case "clip":
      return handleClip(url, options);
    default:
      return handleTranscript(url, options);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  try {
    let urls: string[] = [];
    if (options.urls.length > 0) {
      urls = options.urls;
    } else if (!process.stdin.isTTY) {
      urls = await readStdinUrls();
    }

    if (urls.length === 0) {
      console.error("Error: No YouTube URL provided.\n");
      printHelp();
      process.exit(1);
    }

    if (options.command === "search" && !options.query) {
      console.error('Error: Search requires a query. Usage: scrbd search <url> "query"');
      process.exit(1);
    }

    if (urls.length === 1) {
      console.log(await processUrl(urls[0], options));
    } else {
      const results = await Promise.allSettled(urls.map((url) => processUrl(url, options)));

      for (let i = 0; i < urls.length; i++) {
        console.log(`--- ${urls[i]} ---`);
        const result = results[i];
        if (result.status === "fulfilled") {
          console.log(result.value);
        } else {
          console.error(`Error: ${result.reason instanceof Error ? result.reason.message : result.reason}`);
        }
        console.log();
      }
    }
  } catch (err: unknown) {
    console.error(`Error: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
}

main();
