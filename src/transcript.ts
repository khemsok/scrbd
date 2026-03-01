export type TranscriptEntry = {
  text: string;
  start: number;
  duration: number;
};

export type CaptionTrack = {
  baseUrl: string;
  languageCode: string;
  name: string;
  kind?: string;
};

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const INNERTUBE_API_URL = "https://www.youtube.com/youtubei/v1/player";
const INNERTUBE_CONTEXT = {
  client: { clientName: "ANDROID", clientVersion: "20.10.38" },
};

export function extractVideoId(input: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  return null;
}

async function fetchApiKey(videoId: string): Promise<string> {
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: { "User-Agent": USER_AGENT, "Accept-Language": "en-US,en;q=0.9" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch video page: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const match = html.match(/"INNERTUBE_API_KEY":\s*"([a-zA-Z0-9_-]+)"/);

  if (!match) {
    throw new Error("Could not extract API key from YouTube page.");
  }

  return match[1];
}

async function fetchCaptionTracks(
  videoId: string,
  apiKey: string
): Promise<CaptionTrack[]> {
  const res = await fetch(`${INNERTUBE_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": USER_AGENT },
    body: JSON.stringify({
      context: INNERTUBE_CONTEXT,
      videoId,
    }),
  });

  if (!res.ok) {
    throw new Error(`InnerTube API request failed: ${res.status}`);
  }

  const data = await res.json();

  if (data.playabilityStatus?.status !== "OK") {
    throw new Error(
      `Video unavailable: ${data.playabilityStatus?.reason ?? "unknown reason"}`
    );
  }

  const tracks =
    data.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  if (!tracks || tracks.length === 0) {
    throw new Error("No caption tracks found. The video may not have subtitles.");
  }

  return tracks.map((track: any) => ({
    baseUrl: track.baseUrl.replace("&fmt=srv3", ""),
    languageCode: track.languageCode,
    name: track.name?.simpleText ?? track.languageCode,
    kind: track.kind,
  }));
}

async function fetchCaptionXml(trackUrl: string): Promise<string> {
  const res = await fetch(trackUrl);

  if (!res.ok) {
    throw new Error(`Failed to fetch captions: ${res.status}`);
  }

  return res.text();
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\n/g, " ");
}

function parseTranscriptXml(xml: string): TranscriptEntry[] {
  const entries: TranscriptEntry[] = [];
  const regex = /<text start="([^"]*)" dur="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g;

  let match;
  while ((match = regex.exec(xml)) !== null) {
    entries.push({
      start: parseFloat(match[1]),
      duration: parseFloat(match[2]),
      text: decodeHtmlEntities(match[3].trim()),
    });
  }

  return entries;
}

export async function getTranscript(
  videoId: string,
  lang?: string
): Promise<TranscriptEntry[]> {
  const apiKey = await fetchApiKey(videoId);
  const tracks = await fetchCaptionTracks(videoId, apiKey);

  let track: CaptionTrack | undefined;

  if (lang) {
    track = tracks.find((t) => t.languageCode === lang);
    if (!track) {
      const available = tracks
        .map((t) => `${t.languageCode} (${t.name})`)
        .join(", ");
      throw new Error(
        `No caption track for "${lang}". Available: ${available}`
      );
    }
  } else {
    track =
      tracks.find((t) => !t.kind && t.languageCode.startsWith("en")) ??
      tracks.find((t) => t.languageCode.startsWith("en")) ??
      tracks[0];
  }

  const xml = await fetchCaptionXml(track.baseUrl);
  return parseTranscriptXml(xml);
}

export function parseTimestamp(str: string): number {
  const parts = str.split(":").map(Number);
  if (parts.some(isNaN)) throw new Error(`Invalid timestamp: "${str}"`);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

export function clipTranscript(
  entries: TranscriptEntry[],
  fromSec: number,
  toSec: number
): TranscriptEntry[] {
  return entries.filter(
    (e) => e.start + e.duration >= fromSec && e.start <= toSec
  );
}

export type SearchResult = {
  entry: TranscriptEntry;
  context: TranscriptEntry[];
};

export function searchTranscript(
  entries: TranscriptEntry[],
  query: string
): SearchResult[] {
  const lower = query.toLowerCase();
  const results: SearchResult[] = [];

  for (let i = 0; i < entries.length; i++) {
    if (entries[i].text.toLowerCase().includes(lower)) {
      const context = entries.slice(Math.max(0, i - 1), i + 2);
      results.push({ entry: entries[i], context });
    }
  }

  return results;
}