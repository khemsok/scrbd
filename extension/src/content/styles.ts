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

/* ── TAB BAR ── */
.scrbd-tab-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  flex-wrap: nowrap;
}

.scrbd-tab-bar::-webkit-scrollbar { display: none; }
.scrbd-tab-bar { -ms-overflow-style: none; scrollbar-width: none; }

.scrbd-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--yt-font);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 6px 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.scrbd-tab:hover:not(:disabled) {
  color: var(--text-secondary);
  border-color: var(--border-hover);
  background: var(--surface);
}

.scrbd-tab:active:not(:disabled) {
  transform: scale(0.96);
}

.scrbd-tab:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.scrbd-tab.active {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border-hover);
}

.scrbd-tab-icon {
  display: inline-flex;
  align-items: center;
  opacity: 0.5;
}

.scrbd-tab-icon svg {
  display: block;
}

.scrbd-tab.active .scrbd-tab-icon {
  opacity: 1;
}

/* ── GEAR BUTTON ── */
.scrbd-gear-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.scrbd-gear {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s ease, color 0.12s ease;
  flex-shrink: 0;
  font-size: 15px;
  line-height: 1;
}

.scrbd-gear:hover {
  background: var(--surface);
  color: var(--text);
}

.scrbd-gear-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  display: none;
}

.scrbd-gear-dot.visible {
  display: block;
  animation: scrbd-pulse 2s ease-in-out infinite;
}

@keyframes scrbd-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── AI CONTENT AREA ── */
.scrbd-ai-content {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-secondary);
}

.scrbd-ai-content::-webkit-scrollbar { width: 4px; }
.scrbd-ai-content::-webkit-scrollbar-track { background: transparent; }
.scrbd-ai-content::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 2px; }

/* ── AI LOADING DOTS ── */
.scrbd-ai-loading {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 20px 0;
  justify-content: center;
}

.scrbd-ai-loading-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  animation: scrbd-bounce 1.4s ease-in-out infinite;
}

.scrbd-ai-loading-dot:nth-child(2) { animation-delay: 0.16s; }
.scrbd-ai-loading-dot:nth-child(3) { animation-delay: 0.32s; }

@keyframes scrbd-bounce {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

/* ── STREAMING CURSOR ── */
.scrbd-cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  background: var(--accent);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: scrbd-blink 0.8s step-end infinite;
}

@keyframes scrbd-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ── STRUCTURED SUMMARY VIEW ── */
.scrbd-ai-structured {
  padding: 0;
}

.scrbd-ai-summary-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.scrbd-ai-badge {
  font-family: var(--mono);
  font-size: 9px;
  color: var(--accent);
  background: var(--accent-dim);
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.scrbd-ai-model {
  font-family: var(--mono);
  font-size: 9px;
  color: var(--text-muted);
}

.scrbd-ai-tldr {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 14px;
  padding: 10px 12px;
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
  border-left: 2px solid var(--accent);
}

.scrbd-ai-section {
  margin-bottom: 12px;
}

.scrbd-ai-section:last-child {
  margin-bottom: 0;
}

.scrbd-ai-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.scrbd-ai-section-title::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

.scrbd-ai-points {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
  margin: 0;
}

.scrbd-ai-points li {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  padding: 6px 10px 6px 20px;
  background: var(--surface);
  border-radius: var(--radius-xs);
  position: relative;
}

.scrbd-ai-points li::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 11px;
  width: 5px;
  height: 5px;
  border-radius: 1px;
  background: var(--accent-dim);
  border: 1px solid var(--accent);
  transform: rotate(45deg);
}

.scrbd-ai-points li strong {
  color: var(--text);
  font-weight: 600;
}

.scrbd-ai-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.scrbd-ai-topic {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-secondary);
  background: var(--surface);
  padding: 3px 8px;
  border-radius: 4px;
}

/* ── GENERIC AI PROSE (ELI5, translate, etc.) ── */
.scrbd-ai-prose h3,
.scrbd-ai-prose h4 {
  color: var(--text);
  margin: 12px 0 6px;
  line-height: 1.3;
}

.scrbd-ai-prose h3 { font-size: 14px; }
.scrbd-ai-prose h4 { font-size: 13px; }

.scrbd-ai-prose h3:first-child,
.scrbd-ai-prose h4:first-child {
  margin-top: 0;
}

.scrbd-ai-prose strong {
  color: var(--text);
  font-weight: 600;
}

.scrbd-ai-prose ul {
  margin: 6px 0;
  padding-left: 18px;
}

.scrbd-ai-prose li {
  margin-bottom: 3px;
}

/* ── CHAT VIEW ── */
.scrbd-chat-messages {
  max-height: 400px;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scrbd-chat-messages.empty {
  display: none;
}

.scrbd-chat-messages::-webkit-scrollbar { width: 4px; }
.scrbd-chat-messages::-webkit-scrollbar-track { background: transparent; }
.scrbd-chat-messages::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 2px; }

.scrbd-chat-msg {
  display: flex;
}

.scrbd-chat-msg.user {
  justify-content: flex-end;
}

.scrbd-chat-bubble {
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-secondary);
  word-break: break-word;
}

.scrbd-chat-msg.user .scrbd-chat-bubble {
  background: var(--accent);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.scrbd-chat-msg.assistant .scrbd-chat-bubble {
  background: var(--surface);
  border-bottom-left-radius: 4px;
}

.scrbd-chat-msg.assistant .scrbd-chat-bubble strong {
  color: var(--text);
}

.scrbd-chat-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px;
}

.scrbd-chat-suggestion {
  font-family: var(--yt-font);
  font-size: 11px;
  color: var(--text-secondary);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 5px 12px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.scrbd-chat-suggestion:hover {
  background: var(--accent-dim);
  color: var(--accent);
  border-color: var(--accent-glow);
}

.scrbd-chat-input-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-top: 1px solid var(--border);
}

.scrbd-chat-input {
  flex: 1;
  font-family: var(--yt-font);
  font-size: 13px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  outline: none;
  transition: all 0.15s ease;
}

.scrbd-chat-input::placeholder {
  color: var(--text-muted);
}

.scrbd-chat-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-dim);
}

.scrbd-chat-send {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.scrbd-chat-send:hover {
  opacity: 0.85;
}

.scrbd-chat-send:active {
  transform: scale(0.92);
}

/* Timestamp ref chips */
.scrbd-ref-chip {
  display: inline-block;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--accent);
  background: var(--accent-dim);
  padding: 1px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.12s ease;
}

.scrbd-ref-chip:hover {
  background: var(--accent-glow);
}

/* ── QUIZ VIEW ── */
.scrbd-quiz-cards {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.scrbd-quiz-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px;
}

.scrbd-quiz-question {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10px;
  line-height: 1.45;
}

.scrbd-quiz-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.scrbd-quiz-option {
  font-family: var(--yt-font);
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  padding: 8px 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.12s ease;
}

.scrbd-quiz-option:hover:not(.correct):not(.wrong) {
  background: var(--bg-elevated);
  border-color: var(--border-hover);
  color: var(--text);
}

.scrbd-quiz-option.correct {
  background: rgba(52, 199, 89, 0.12);
  border-color: rgba(52, 199, 89, 0.4);
  color: #34c759;
  cursor: default;
}

.scrbd-quiz-option.wrong {
  background: rgba(255, 69, 58, 0.12);
  border-color: rgba(255, 69, 58, 0.4);
  color: #ff453a;
  cursor: default;
}

.scrbd-quiz-option.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.scrbd-quiz-regen {
  font-family: var(--yt-font);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  cursor: pointer;
  width: 100%;
  transition: all 0.12s ease;
}

.scrbd-quiz-regen:hover {
  color: var(--text);
  border-color: var(--border-hover);
  background: var(--bg-elevated);
}

.scrbd-quiz-regen:active {
  transform: scale(0.98);
}

.scrbd-quiz-explanation {
  font-size: 11px;
  color: var(--text-muted);
  padding-top: 8px;
  line-height: 1.5;
  display: none;
}

.scrbd-quiz-explanation.visible {
  display: block;
}

/* ── ONBOARDING VIEW ── */
.scrbd-onboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 24px 24px;
  gap: 0;
}

.scrbd-onboard-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  margin-bottom: 14px;
}

.scrbd-onboard-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6px;
}

.scrbd-onboard-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.55;
  max-width: 280px;
  margin-bottom: 12px;
}

.scrbd-onboard-desc strong {
  color: var(--text);
  font-weight: 600;
}

.scrbd-onboard-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--yt-font);
  font-size: 12px;
  font-weight: 500;
  color: var(--accent);
  text-decoration: none;
  margin-bottom: 16px;
  transition: opacity 0.12s ease;
}

.scrbd-onboard-link:hover {
  opacity: 0.8;
}

.scrbd-onboard-link svg {
  opacity: 0.7;
}

.scrbd-onboard-field {
  width: 100%;
  max-width: 260px;
  margin-bottom: 12px;
}

.scrbd-onboard-input {
  width: 100%;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 9px 12px;
  outline: none;
  text-align: center;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.scrbd-onboard-input::placeholder {
  color: var(--text-muted);
  font-family: var(--mono);
}

.scrbd-onboard-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-dim);
}

.scrbd-onboard-save {
  font-family: var(--yt-font);
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-sm);
  padding: 9px 24px;
  cursor: pointer;
  transition: opacity 0.12s ease, transform 0.12s ease;
  width: 100%;
  max-width: 260px;
}

.scrbd-onboard-save:hover {
  opacity: 0.9;
}

.scrbd-onboard-save:active {
  transform: scale(0.98);
}

.scrbd-onboard-status {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 8px;
  min-height: 14px;
}

.scrbd-onboard-status.error {
  color: #ff453a;
}

.scrbd-onboard-status.success {
  color: #34c759;
}

/* ── SETTINGS (in-content view) ── */
.scrbd-settings {
  padding: 4px 0;
}

.scrbd-settings-section {
  display: flex;
  flex-direction: column;
}

.scrbd-settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
}

.scrbd-settings-row:last-child {
  border-bottom: none;
}

.scrbd-settings-row.stacked {
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.scrbd-settings-row-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex-shrink: 1;
}

.scrbd-settings-row-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
}

.scrbd-settings-row-hint {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scrbd-settings-row-control {
  flex-shrink: 0;
}

.scrbd-settings-row.stacked .scrbd-settings-row-control {
  flex-shrink: 1;
}

.scrbd-settings-input {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  padding: 6px 8px;
  width: 100%;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.scrbd-settings-input:focus {
  border-color: var(--accent);
}

.scrbd-settings-input::placeholder {
  color: var(--text-muted);
  font-family: var(--mono);
}

.scrbd-settings-select {
  font-family: var(--yt-font);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  padding: 6px 22px 6px 8px;
  outline: none;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l3 3 3-3' stroke='%23717171' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 7px center;
  transition: all 0.12s ease;
}

.scrbd-settings-select:hover {
  border-color: var(--border-hover);
  color: var(--text);
}

.scrbd-settings-select:focus {
  border-color: var(--accent);
}

/* Toggle switch */
.scrbd-toggle {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.scrbd-toggle input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.scrbd-toggle-track {
  display: block;
  width: 34px;
  height: 18px;
  border-radius: 9px;
  background: var(--surface);
  border: 1px solid var(--border);
  position: relative;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.scrbd-toggle-track::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text-muted);
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease, background 0.2s ease;
}

.scrbd-toggle input:checked + .scrbd-toggle-track {
  background: var(--accent);
  border-color: var(--accent);
}

.scrbd-toggle input:checked + .scrbd-toggle-track::after {
  transform: translateX(16px);
  background: #fff;
}

/* Actions footer */
.scrbd-settings-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-top: 1px solid var(--border);
}

.scrbd-settings-status {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-muted);
}

.scrbd-settings-status.success { color: #34c759; }
.scrbd-settings-status.error { color: #ff453a; }

.scrbd-settings-btns {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.scrbd-settings-cancel {
  font-family: var(--yt-font);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  padding: 5px 14px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.scrbd-settings-cancel:hover {
  color: var(--text-secondary);
  border-color: var(--border-hover);
}

.scrbd-settings-save {
  font-family: var(--yt-font);
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-xs);
  padding: 5px 18px;
  cursor: pointer;
  transition: opacity 0.12s ease;
}

.scrbd-settings-save:hover {
  opacity: 0.85;
}

.scrbd-settings-save:active {
  transform: scale(0.98);
}
`;
