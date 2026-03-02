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

const INNERTUBE_API_URL = "https://www.youtube.com/youtubei/v1/player";
const INNERTUBE_CONTEXT = {
  client: { clientName: "ANDROID", clientVersion: "20.10.38" },
};

async function fetchCaptionTracks(
  videoId: string,
  apiKey: string
): Promise<CaptionTrack[]> {
  const res = await fetch(`${INNERTUBE_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

const ENTITY_RE = /&(?:amp|lt|gt|quot|apos|#(\d+)|#39);/g;
const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">",
  "&quot;": '"', "&#39;": "'", "&apos;": "'",
};

function replaceEntities(text: string): string {
  return text.replace(ENTITY_RE, (match, code) =>
    code ? String.fromCharCode(Number(code)) : (HTML_ENTITIES[match] ?? match)
  );
}

function decodeHtmlEntities(text: string): string {
  // Two passes to handle double-encoded entities (e.g. &amp;#39; → &#39; → ')
  return replaceEntities(replaceEntities(text)).replace(/\n/g, " ");
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
  apiKey: string,
  lang?: string
): Promise<{ entries: TranscriptEntry[]; tracks: CaptionTrack[] }> {
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
  const entries = parseTranscriptXml(xml);
  return { entries, tracks };
}
