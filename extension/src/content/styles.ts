export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }

:host {
  /* ── Dark mode defaults (YouTube dark is most common) ── */
  --bg: #1a1a1a;
  --bg-elevated: #242424;
  --surface: #2a2a2a;
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.15);
  --text: #f1f1f1;
  --text-secondary: #aaaaaa;
  --text-muted: #717171;
  --accent: #c4593a;
  --accent-dim: rgba(196, 89, 58, 0.12);
  --accent-glow: rgba(196, 89, 58, 0.25);
  --mono: 'Space Mono', 'Courier New', monospace;
  --yt-font: 'Roboto', 'Arial', sans-serif;
  --radius: 12px;
  --radius-sm: 8px;
  --radius-xs: 4px;

  display: block;
  padding-bottom: 16px;
  padding-top: 12px;
  font-family: var(--yt-font);
  color: var(--text);
  font-size: 14px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}

/* ── Light mode ── */
:host(.light) {
  --bg: #ffffff;
  --bg-elevated: #f8f8f8;
  --surface: #f2f2f2;
  --border: rgba(0, 0, 0, 0.08);
  --border-hover: rgba(0, 0, 0, 0.15);
  --text: #0f0f0f;
  --text-secondary: #606060;
  --text-muted: #909090;
  --accent: #b5451e;
  --accent-dim: rgba(181, 69, 30, 0.08);
  --accent-glow: rgba(181, 69, 30, 0.18);
}


/* ── PANEL ── */
.scrbd-panel {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  position: relative;
  transition: border-color 0.2s ease;
}

.scrbd-panel:hover {
  border-color: var(--border-hover);
}

.scrbd-panel > * {
  position: relative;
  z-index: 1;
}

/* ── HEADER ── */
.scrbd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease;
}

.scrbd-panel.expanded .scrbd-header {
  border-bottom: 1px solid var(--border);
}

.scrbd-header:hover {
  background: var(--bg-elevated);
}

.scrbd-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scrbd-logo {
  font-family: var(--yt-font);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
  line-height: 1;
}

.scrbd-logo span {
  color: var(--accent);
}

.scrbd-badge {
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 400;
  color: var(--text-muted);
  background: var(--surface);
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.scrbd-chevron {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s ease;
  flex-shrink: 0;
}

.scrbd-header:hover .scrbd-chevron {
  color: var(--text-secondary);
}

.scrbd-panel.expanded .scrbd-chevron {
  transform: rotate(180deg);
}

/* ── COLLAPSIBLE BODY ── */
.scrbd-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.scrbd-panel.expanded .scrbd-body {
  grid-template-rows: 1fr;
}

.scrbd-body-inner {
  overflow: hidden;
}

/* ── CONTROLS BAR ── */
.scrbd-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.scrbd-select {
  font-family: var(--yt-font);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--surface);
  border: 1px solid transparent;
  border-radius: var(--radius-xs);
  padding: 4px 22px 4px 8px;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l3 3 3-3' stroke='%23717171' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 7px center;
  transition: all 0.12s ease;
}

.scrbd-select:hover {
  background-color: var(--bg-elevated);
  border-color: var(--border-hover);
  color: var(--text);
}

.scrbd-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-dim);
}

.scrbd-controls-spacer {
  flex: 1;
}

.scrbd-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: var(--yt-font);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-xs);
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.12s ease;
  white-space: nowrap;
}

.scrbd-btn:hover {
  background: var(--surface);
  color: var(--text);
}

.scrbd-btn:active {
  transform: scale(0.96);
}

.scrbd-btn svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.scrbd-btn.copied {
  background: var(--accent);
  color: #fff;
}

/* ── SEARCH BAR ── */
.scrbd-search-wrap {
  position: relative;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
}

.scrbd-search {
  width: 100%;
  font-family: var(--yt-font);
  font-size: 13px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 7px 12px 7px 32px;
  outline: none;
  transition: all 0.15s ease;
}

.scrbd-search::placeholder {
  color: var(--text-muted);
}

.scrbd-search:focus {
  background: var(--bg-elevated);
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-dim);
}

.scrbd-search-icon {
  position: absolute;
  left: 23px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--text-muted);
  pointer-events: none;
}

.scrbd-search-count {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-muted);
  pointer-events: none;
}

/* ── TRANSCRIPT AREA ── */
.scrbd-transcript {
  max-height: 500px;
  overflow-y: auto;
  padding: 4px 0;
  scroll-behavior: smooth;
}

.scrbd-transcript::-webkit-scrollbar {
  width: 4px;
}

.scrbd-transcript::-webkit-scrollbar-track {
  background: transparent;
}

.scrbd-transcript::-webkit-scrollbar-thumb {
  background: var(--border-hover);
  border-radius: 2px;
}

.scrbd-transcript::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Transcript entry row */
.scrbd-entry {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 12px;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: all 0.1s ease;
}

.scrbd-entry:hover {
  background: var(--bg-elevated);
}

.scrbd-entry.active {
  background: var(--accent-dim);
  border-left-color: var(--accent);
}

.scrbd-entry.highlight {
  background: var(--accent-dim);
}

.scrbd-timestamp {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 400;
  color: var(--text-muted);
  padding: 1px 0;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
  transition: color 0.1s ease;
}

.scrbd-entry:hover .scrbd-timestamp {
  color: var(--accent);
}

.scrbd-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.scrbd-entry:hover .scrbd-text {
  color: var(--text);
}

.scrbd-text mark {
  background: var(--accent-glow);
  color: var(--text);
  border-radius: 2px;
  padding: 0 2px;
}

/* ── CODE VIEW (JSON, SRT, Markdown) ── */
.scrbd-code-view {
  max-height: 500px;
  overflow: auto;
  padding: 12px;
}

.scrbd-code-view::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.scrbd-code-view::-webkit-scrollbar-track {
  background: transparent;
}

.scrbd-code-view::-webkit-scrollbar-thumb {
  background: var(--border-hover);
  border-radius: 2px;
}

.scrbd-code-view pre {
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

/* ── LOADING SKELETON ── */
.scrbd-skeleton {
  padding: 10px 12px;
}

.scrbd-skeleton-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
}

.scrbd-skeleton-ts {
  width: 40px;
  height: 16px;
  background: var(--surface);
  border-radius: 3px;
  flex-shrink: 0;
  animation: scrbd-shimmer 2s ease-in-out infinite;
}

.scrbd-skeleton-text {
  height: 12px;
  background: var(--surface);
  border-radius: 3px;
  animation: scrbd-shimmer 2s ease-in-out infinite;
}

.scrbd-skeleton-row:nth-child(1) .scrbd-skeleton-text { width: 85%; animation-delay: 0.05s; }
.scrbd-skeleton-row:nth-child(2) .scrbd-skeleton-text { width: 72%; animation-delay: 0.1s; }
.scrbd-skeleton-row:nth-child(3) .scrbd-skeleton-text { width: 90%; animation-delay: 0.15s; }
.scrbd-skeleton-row:nth-child(4) .scrbd-skeleton-text { width: 65%; animation-delay: 0.2s; }
.scrbd-skeleton-row:nth-child(5) .scrbd-skeleton-text { width: 78%; animation-delay: 0.25s; }
.scrbd-skeleton-row:nth-child(6) .scrbd-skeleton-text { width: 82%; animation-delay: 0.3s; }
.scrbd-skeleton-row:nth-child(7) .scrbd-skeleton-text { width: 60%; animation-delay: 0.35s; }

@keyframes scrbd-shimmer {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
}

/* ── ERROR STATE ── */
.scrbd-error {
  padding: 24px 16px;
  text-align: center;
}

.scrbd-error-icon {
  width: 32px;
  height: 32px;
  color: var(--text-muted);
  margin: 0 auto 10px;
  opacity: 0.5;
}

.scrbd-error-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.scrbd-error-msg {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  max-width: 240px;
  margin: 0 auto;
}

.scrbd-retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  font-family: var(--yt-font);
  font-size: 12px;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-dim);
  border: none;
  border-radius: var(--radius-xs);
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.scrbd-retry-btn:hover {
  background: var(--accent-glow);
}

/* ── TOAST ── */
.scrbd-toast {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  font-family: var(--yt-font);
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background: #323232;
  padding: 6px 16px;
  border-radius: 6px;
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.scrbd-toast.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ── FOOTER ── */
.scrbd-footer {
  padding: 6px 12px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.scrbd-footer-info {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-muted);
}
`;
