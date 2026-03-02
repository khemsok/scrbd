import {
  getTranscript,
  type TranscriptEntry,
  type CaptionTrack,
} from "../core/transcript";
import {
  formatTimestamp,
  formatPlain,
  formatTimestamped,
  formatJson,
  formatMarkdown,
  formatSrt,
} from "../core/format";
import { styles } from "./styles";

type Format = "plain" | "timestamps" | "json" | "markdown" | "srt";
const CODE_FORMATS: Format[] = ["json", "markdown", "srt"];
const EXT_MAP: Record<Format, string> = {
  plain: "txt", timestamps: "txt", json: "json", markdown: "md", srt: "srt",
};

let currentVideoId: string | null = null;
let apiKey: string | null = null;
let entries: TranscriptEntry[] = [];
let tracks: CaptionTrack[] = [];
let currentFormat: Format = "plain";
let currentLang = "";
let searchQuery = "";
let panelExpanded = false;
let hostEl: HTMLElement | null = null;
let shadowRoot: ShadowRoot | null = null;
let shortsBtnEl: HTMLElement | null = null;
let shortsPopoverEl: HTMLElement | null = null;
let shortsPopoverShadow: ShadowRoot | null = null;
let themeObserver: MutationObserver | null = null;
let documentClickHandler: ((e: MouseEvent) => void) | null = null;
let resizeHandler: (() => void) | null = null;

const ICONS = {
  chevron: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 8 10 12 14 8"/></svg>`,
  search: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5.5"/><line x1="12.5" y1="12.5" x2="17" y2="17"/></svg>`,
  copy: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="11" height="11" rx="2"/><path d="M4 14V4a2 2 0 012-2h10"/></svg>`,
  download: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3v10m0 0l-3.5-3.5M10 13l3.5-3.5"/><path d="M3 15v1a2 2 0 002 2h10a2 2 0 002-2v-1"/></svg>`,
  error: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="20" cy="20" r="16"/><path d="M20 12v10" stroke-linecap="round"/><circle cx="20" cy="27" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  check: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 10 9 14 15 6"/></svg>`,
};

function extractApiKey(): Promise<string> {
  return new Promise((resolve, reject) => {
    const cleanup = () => window.removeEventListener("message", handler);

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Timed out waiting for YouTube API key."));
    }, 5000);

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "SCRBD_API_KEY") {
        clearTimeout(timeout);
        cleanup();
        if (event.data.apiKey) {
          resolve(event.data.apiKey);
        } else {
          reject(new Error("Could not extract YouTube API key from page."));
        }
      }
    };
    window.addEventListener("message", handler);

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("dist/inject.js");
    script.onload = () => script.remove();
    script.onerror = () => {
      clearTimeout(timeout);
      cleanup();
      reject(new Error("Failed to inject API key extraction script."));
    };
    (document.head || document.documentElement).appendChild(script);
  });
}

function getVideoId(): string | null {
  const url = new URL(window.location.href);
  const v = url.searchParams.get("v");
  if (v) return v;
  const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  return null;
}

function buildPanelHTML(): string {
  return `
    <div class="scrbd-panel">
      <div class="scrbd-header">
        <div class="scrbd-brand">
          <div class="scrbd-logo"><span>s</span>crbd</div>
          <div class="scrbd-badge">transcript</div>
        </div>
        ${ICONS.chevron.replace('<svg ', '<svg class="scrbd-chevron" ')}
      </div>
      <div class="scrbd-body">
        <div class="scrbd-body-inner">
          <div class="scrbd-controls">
            <select class="scrbd-select" id="scrbd-format">
              <option value="plain">Plain</option>
              <option value="timestamps">Timestamps</option>
              <option value="json">JSON</option>
              <option value="markdown">Markdown</option>
              <option value="srt">SRT</option>
            </select>
            <select class="scrbd-select" id="scrbd-lang"></select>
            <div class="scrbd-controls-spacer"></div>
            <button class="scrbd-btn" id="scrbd-copy">${ICONS.copy} Copy</button>
            <button class="scrbd-btn" id="scrbd-download">${ICONS.download} Save</button>
          </div>
          <div class="scrbd-search-wrap">
            ${ICONS.search.replace('<svg ', '<svg class="scrbd-search-icon" ')}
            <input class="scrbd-search" id="scrbd-search" type="text" placeholder="Search transcript..." autocomplete="off" />
            <span class="scrbd-search-count" id="scrbd-search-count"></span>
          </div>
          <div id="scrbd-content">
            ${buildSkeletonHTML()}
          </div>
          <div class="scrbd-footer">
            <span class="scrbd-footer-info" id="scrbd-info"></span>
          </div>
        </div>
      </div>
      <div class="scrbd-toast" id="scrbd-toast">Copied!</div>
    </div>
  `;
}

function buildSkeletonHTML(): string {
  return `
    <div class="scrbd-skeleton">
      ${Array.from({ length: 7 }, () => `
        <div class="scrbd-skeleton-row">
          <div class="scrbd-skeleton-ts"></div>
          <div class="scrbd-skeleton-text"></div>
        </div>
      `).join("")}
    </div>
  `;
}

function buildErrorHTML(message: string): string {
  return `
    <div class="scrbd-error">
      <div class="scrbd-error-icon">${ICONS.error}</div>
      <div class="scrbd-error-title">No transcript available</div>
      <div class="scrbd-error-msg">${escapeHtml(message)}</div>
      <button class="scrbd-retry-btn" id="scrbd-retry">Try again</button>
    </div>
  `;
}

function buildTranscriptHTML(items: TranscriptEntry[], query: string): string {
  if (items.length === 0) {
    return buildErrorHTML("No transcript entries found for this video.");
  }

  const lowerQuery = query ? query.toLowerCase() : "";
  const regex = query ? new RegExp(`(${escapeRegex(query)})`, "gi") : null;

  const rows = items.map((entry) => {
    const ts = formatTimestamp(entry.start);
    let text = escapeHtml(entry.text);

    if (regex) {
      text = text.replace(regex, "<mark>$1</mark>");
    }

    const highlight = lowerQuery && entry.text.toLowerCase().includes(lowerQuery);
    return `
      <div class="scrbd-entry${highlight ? " highlight" : ""}" data-time="${entry.start}">
        <span class="scrbd-timestamp">${ts}</span>
        <span class="scrbd-text">${text}</span>
      </div>
    `;
  }).join("");

  return `<div class="scrbd-transcript">${rows}</div>`;
}

function buildCodeViewHTML(text: string): string {
  return `<div class="scrbd-code-view"><pre>${escapeHtml(text)}</pre></div>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function $(id: string): HTMLElement | null {
  return shadowRoot?.getElementById(id) ?? null;
}

function $q(selector: string): HTMLElement | null {
  return shadowRoot?.querySelector(selector) ?? null;
}

function getFilteredEntries(): TranscriptEntry[] {
  if (!searchQuery) return entries;
  const q = searchQuery.toLowerCase();
  return entries.filter((e) => e.text.toLowerCase().includes(q));
}

function renderContent() {
  const contentEl = $("scrbd-content");
  if (!contentEl) return;

  const filtered = getFilteredEntries();

  if (CODE_FORMATS.includes(currentFormat)) {
    contentEl.innerHTML = buildCodeViewHTML(getFormattedText(filtered));
  } else {
    contentEl.innerHTML = buildTranscriptHTML(filtered, searchQuery);
    bindEntryClicks();
  }

  updateInfo(filtered);
  updateSearchCount(filtered);
}

function getFormattedText(filtered?: TranscriptEntry[]): string {
  const items = filtered ?? getFilteredEntries();
  switch (currentFormat) {
    case "plain": return formatPlain(items);
    case "timestamps": return formatTimestamped(items);
    case "json": return formatJson(items);
    case "markdown": return formatMarkdown(items);
    case "srt": return formatSrt(items);
    default: return formatPlain(items);
  }
}

function updateInfo(filtered: TranscriptEntry[]) {
  const infoEl = $("scrbd-info");
  if (!infoEl) return;
  infoEl.textContent = `${filtered.length} entries`;
}

function updateSearchCount(filtered: TranscriptEntry[]) {
  const countEl = $("scrbd-search-count");
  if (!countEl) return;
  if (!searchQuery) {
    countEl.textContent = "";
    return;
  }
  countEl.textContent = `${filtered.length} found`;
}

function populateLanguages() {
  const langSelect = $("scrbd-lang") as HTMLSelectElement | null;
  if (!langSelect) return;
  langSelect.innerHTML = tracks
    .map((t) => `<option value="${t.languageCode}"${t.languageCode === currentLang ? " selected" : ""}>${t.name}</option>`)
    .join("");
}

function bindEvents() {
  const isShorts = window.location.pathname.startsWith("/shorts/");
  if (!isShorts) {
    const header = $q(".scrbd-header");
    header?.addEventListener("click", () => {
      panelExpanded = !panelExpanded;
      const panel = $q(".scrbd-panel");
      panel?.classList.toggle("expanded", panelExpanded);
    });
  }

  const formatSelect = $("scrbd-format") as HTMLSelectElement | null;
  formatSelect?.addEventListener("change", () => {
    currentFormat = formatSelect.value as Format;
    renderContent();
  });

  const langSelect = $("scrbd-lang") as HTMLSelectElement | null;
  langSelect?.addEventListener("change", async () => {
    currentLang = langSelect.value;
    await loadTranscript();
  });

  // Stop key events from reaching YouTube's shortcuts (f=fullscreen, k=pause, etc.)
  const searchInput = $("scrbd-search") as HTMLInputElement | null;
  searchInput?.addEventListener("keydown", (e) => e.stopPropagation());
  searchInput?.addEventListener("keyup", (e) => e.stopPropagation());
  searchInput?.addEventListener("keypress", (e) => e.stopPropagation());
  let searchTimeout: ReturnType<typeof setTimeout>;
  searchInput?.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchQuery = searchInput.value.trim();
      renderContent();
    }, 200);
  });

  const copyBtn = $("scrbd-copy");
  copyBtn?.addEventListener("click", async () => {
    const text = getFormattedText();
    await navigator.clipboard.writeText(text);
    showToast("Copied!");
    copyBtn.classList.add("copied");
    copyBtn.innerHTML = `${ICONS.check} Copied`;
    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtn.innerHTML = `${ICONS.copy} Copy`;
    }, 1800);
  });

  const downloadBtn = $("scrbd-download");
  downloadBtn?.addEventListener("click", () => {
    const text = getFormattedText();
    const ext = EXT_MAP[currentFormat];
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scrbd-${currentVideoId}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded!");
  });
}

function bindEntryClicks() {
  const transcriptEl = shadowRoot?.querySelector(".scrbd-transcript");
  if (!transcriptEl) return;

  transcriptEl.addEventListener("click", (e) => {
    const entry = (e.target as HTMLElement).closest(".scrbd-entry") as HTMLElement | null;
    if (!entry) return;
    const time = parseFloat(entry.dataset.time ?? "0");
    seekVideo(time);
    shadowRoot?.querySelectorAll(".scrbd-entry.active").forEach((el) => el.classList.remove("active"));
    entry.classList.add("active");
  });
}

function bindRetry() {
  const retryBtn = $("scrbd-retry");
  retryBtn?.addEventListener("click", () => loadTranscript());
}

function seekVideo(seconds: number) {
  const isShorts = window.location.pathname.startsWith("/shorts/");
  const video = isShorts
    ? document.querySelector("ytd-reel-video-renderer[is-active] video") as HTMLVideoElement
      ?? document.querySelector("#shorts-player video") as HTMLVideoElement
    : document.querySelector("#movie_player video") as HTMLVideoElement
      ?? document.querySelector("ytd-player video") as HTMLVideoElement;

  if (!video) return;
  video.currentTime = seconds;
  video.play().catch(() => {});
}

function showToast(message: string) {
  const toast = $("scrbd-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2000);
}

async function loadTranscript() {
  const contentEl = $("scrbd-content");
  if (!contentEl) return;

  contentEl.innerHTML = buildSkeletonHTML();

  try {
    if (!apiKey) {
      apiKey = await extractApiKey();
    }

    if (!currentVideoId) return;
    const result = await getTranscript(currentVideoId, apiKey, currentLang || undefined);
    entries = result.entries;
    tracks = result.tracks;

    if (!currentLang && tracks.length > 0) {
      const selected =
        tracks.find((t) => !t.kind && t.languageCode.startsWith("en")) ??
        tracks.find((t) => t.languageCode.startsWith("en")) ??
        tracks[0];
      currentLang = selected.languageCode;
    }

    populateLanguages();
    renderContent();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load transcript.";
    contentEl.innerHTML = buildErrorHTML(message);
    bindRetry();
  }
}

function detectThemeChanges() {
  if (themeObserver) themeObserver.disconnect();
  themeObserver = new MutationObserver(() => {
    if (!hostEl) return;
    const isDark = document.documentElement.hasAttribute("dark");
    hostEl.classList.toggle("light", !isDark);
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["dark"] });
}

function injectPanel() {
  removePanel();

  const isShorts = window.location.pathname.startsWith("/shorts/");
  if (isShorts) {
    injectShortsPanel();
  } else {
    injectWatchPanel();
  }

  panelExpanded = false;
  bindEvents();
}

function injectWatchPanel() {
  hostEl = document.createElement("div");
  hostEl.id = "scrbd-host";
  hostEl.style.display = "block";
  hostEl.style.marginTop = "12px";
  hostEl.style.marginBottom = "16px";
  shadowRoot = hostEl.attachShadow({ mode: "open" });

  const isDark = document.documentElement.hasAttribute("dark");
  if (!isDark) hostEl.classList.add("light");
  detectThemeChanges();

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  shadowRoot.appendChild(styleEl);

  const wrapper = document.createElement("div");
  wrapper.innerHTML = buildPanelHTML();
  shadowRoot.appendChild(wrapper);

  const container = document.querySelector("#secondary-inner") || document.querySelector("#secondary");
  if (!container) return;
  container.prepend(hostEl);
}

function injectShortsPanel() {
  shortsBtnEl = document.createElement("div");
  shortsBtnEl.id = "scrbd-shorts-btn";
  shortsBtnEl.style.cssText = `
    display: flex; flex-direction: column; align-items: center;
    margin-bottom: 16px; cursor: pointer; -webkit-user-select: none;
  `;
  shortsBtnEl.innerHTML = `
    <button style="
      width: 48px; height: 48px; border-radius: 50%; border: none;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background 0.2s ease;
      outline: none; position: relative;
    " id="scrbd-shorts-toggle">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="white" stroke-width="1.7" fill="none"/>
        <line x1="8" y1="8" x2="16" y2="8" stroke="white" stroke-width="1.7" stroke-linecap="round"/>
        <line x1="8" y1="12" x2="16" y2="12" stroke="white" stroke-width="1.7" stroke-linecap="round"/>
        <line x1="8" y1="16" x2="12.5" y2="16" stroke="#c4593a" stroke-width="1.7" stroke-linecap="round"/>
      </svg>
    </button>
    <span style="
      font-family: 'Roboto', Arial, sans-serif;
      font-size: 12px; color: white; margin-top: 6px;
      font-weight: 400; line-height: 1;
    ">scrbd</span>
  `;

  const btn = shortsBtnEl.querySelector('#scrbd-shorts-toggle') as HTMLElement;
  btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(255,255,255,0.2)'; });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = panelExpanded ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)';
  });

  const actionsBar = document.querySelector("ytd-reel-player-overlay-renderer #actions #button-bar")
    || document.querySelector("ytd-reel-player-overlay-renderer #actions");
  if (actionsBar && actionsBar.parentElement) {
    actionsBar.parentElement.insertBefore(shortsBtnEl, actionsBar);
  }

  shortsPopoverEl = document.createElement("div");
  shortsPopoverEl.id = "scrbd-shorts-popover";
  shortsPopoverEl.style.cssText = `
    position: fixed; width: 360px; max-height: 50vh;
    z-index: 99999; display: none;
    transition: opacity 0.2s ease;
    opacity: 0;
  `;
  shortsPopoverShadow = shortsPopoverEl.attachShadow({ mode: "open" });

  const isDark = document.documentElement.hasAttribute("dark");
  if (!isDark) shortsPopoverEl.classList.add("light");
  detectThemeChanges();

  const styleEl = document.createElement("style");
  styleEl.textContent = styles + `
    :host { padding: 0; }
    .scrbd-panel {
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06);
      border: none;
      border-radius: 16px;
      overflow: hidden;
    }
    .scrbd-body { display: block; }
    .scrbd-panel .scrbd-body { grid-template-rows: 1fr; }
    .scrbd-body-inner { overflow: auto; }
    .scrbd-transcript { max-height: 35vh; }
    .scrbd-code-view { max-height: 35vh; }
    .scrbd-header {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
    }
    .scrbd-chevron { display: none; }
    .scrbd-header { cursor: default; }
    .scrbd-close {
      width: 28px; height: 28px; border-radius: 50%;
      border: none; background: var(--surface);
      color: var(--text-secondary); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.12s ease, color 0.12s ease;
      flex-shrink: 0;
    }
    .scrbd-close:hover { background: var(--border-hover); color: var(--text); }
    .scrbd-close svg { width: 14px; height: 14px; }
  `;
  shortsPopoverShadow.appendChild(styleEl);

  const panelHTML = buildPanelHTML()
    .replace('class="scrbd-panel"', 'class="scrbd-panel expanded"')
    .replace(
      /<svg class="scrbd-chevron"[^>]*>.*?<\/svg>/,
      `<button class="scrbd-close" id="scrbd-close"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="5" x2="15" y2="15"/><line x1="15" y1="5" x2="5" y2="15"/></svg></button>`
    );

  const wrapper = document.createElement("div");
  wrapper.innerHTML = panelHTML;
  shortsPopoverShadow.appendChild(wrapper);

  document.body.appendChild(shortsPopoverEl);

  hostEl = shortsPopoverEl;
  shadowRoot = shortsPopoverShadow;

  function positionPopover() {
    if (!shortsBtnEl || !shortsPopoverEl) return;
    const btnRect = shortsBtnEl.getBoundingClientRect();
    const left = btnRect.right + 12;
    shortsPopoverEl.style.top = '50%';
    shortsPopoverEl.style.transform = 'translateY(-50%)';
    shortsPopoverEl.style.left = `${left}px`;
    shortsPopoverEl.style.right = 'auto';
  }

  function openPopover() {
    if (!shortsPopoverEl) return;
    panelExpanded = true;
    const btnInner = shortsBtnEl?.querySelector('#scrbd-shorts-toggle') as HTMLElement;
    positionPopover();
    shortsPopoverEl.style.display = 'block';
    requestAnimationFrame(() => {
      if (shortsPopoverEl) shortsPopoverEl.style.opacity = '1';
    });
    if (btnInner) btnInner.style.background = 'rgba(255,255,255,0.25)';
  }

  function closePopover() {
    panelExpanded = false;
    if (!shortsPopoverEl) return;
    const btnInner = shortsBtnEl?.querySelector('#scrbd-shorts-toggle') as HTMLElement;
    shortsPopoverEl.style.opacity = '0';
    setTimeout(() => {
      if (!panelExpanded && shortsPopoverEl) shortsPopoverEl.style.display = 'none';
    }, 200);
    if (btnInner) btnInner.style.background = 'rgba(255,255,255,0.1)';
  }

  let closeTimestamp = 0;

  shortsBtnEl.addEventListener("click", (e) => {
    e.stopPropagation();
    if (Date.now() - closeTimestamp < 300) return;
    if (panelExpanded) {
      closePopover();
    } else {
      openPopover();
    }
  });

  const closeBtn = shortsPopoverShadow.getElementById("scrbd-close");
  closeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!panelExpanded) return;
    closeTimestamp = Date.now();
    closePopover();
  });

  documentClickHandler = ((e: MouseEvent) => {
    if (!panelExpanded) return;
    if (shortsBtnEl?.contains(e.target as Node)) return;
    if (shortsPopoverEl?.contains(e.target as Node)) return;
    const path = e.composedPath();
    if (path.includes(shortsPopoverEl as EventTarget)) return;
    closePopover();
  }) as (e: MouseEvent) => void;
  document.addEventListener("click", documentClickHandler);

  let rafId = 0;
  resizeHandler = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(positionPopover); };
  window.addEventListener("resize", resizeHandler);
}

function removePanel() {
  if (themeObserver) { themeObserver.disconnect(); themeObserver = null; }
  if (documentClickHandler) { document.removeEventListener("click", documentClickHandler); documentClickHandler = null; }
  if (resizeHandler) { window.removeEventListener("resize", resizeHandler); resizeHandler = null; }
  if (hostEl) { hostEl.remove(); hostEl = null; shadowRoot = null; }
  if (shortsBtnEl) { shortsBtnEl.remove(); shortsBtnEl = null; }
  if (shortsPopoverEl) { shortsPopoverEl.remove(); shortsPopoverEl = null; shortsPopoverShadow = null; }
}

async function init() {
  const videoId = getVideoId();
  if (!videoId) {
    removePanel();
    return;
  }

  if (videoId === currentVideoId && hostEl) return;

  currentVideoId = videoId;
  entries = [];
  tracks = [];
  searchQuery = "";
  currentLang = "";
  currentFormat = "plain";

  const isShortsPage = window.location.pathname.startsWith("/shorts/");
  if (isShortsPage) {
    await waitForElement("ytd-reel-player-overlay-renderer #actions");
  } else {
    await waitForElement("#secondary-inner, #secondary");
  }

  injectPanel();
  await loadTranscript();
}

function waitForElement(selector: string, timeout = 8000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(selector);
    if (existing) return resolve(existing);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timed out waiting for ${selector}`));
    }, timeout);
  });
}

window.addEventListener("yt-navigate-finish", () => {
  init().catch(console.error);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SCRBD_TOGGLE") {
    if (!hostEl) {
      init().catch(console.error);
    } else {
      panelExpanded = !panelExpanded;
      const panel = shadowRoot?.querySelector(".scrbd-panel");
      panel?.classList.toggle("expanded", panelExpanded);
    }
  }
});

init().catch(console.error);
