import type { AiView, ChatMessage } from "./state";

type TabId = AiView | "transcript";

const TAB_ICONS: Record<string, string> = {
  transcript: `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 4h10M3 8h10M3 12h6"/></svg>`,
  summary: `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 3h10v10H3z"/><path d="M5 6h6M5 8.5h6M5 11h3"/></svg>`,
  chat: `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h12v8H5l-3 3V3z"/></svg>`,
  quiz: `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="7" r="5"/><path d="M6.5 5.5a1.5 1.5 0 012.5 1.2c0 .8-1 1.3-1 1.3M8 10v.5"/></svg>`,
};

const TABS: { id: TabId; label: string }[] = [
  { id: "transcript", label: "Transcript" },
  { id: "summary", label: "Summary" },
  { id: "chat", label: "Ask AI" },
  { id: "quiz", label: "Quiz" },
];


export function buildTabBar(activeTab: TabId, aiEnabled: boolean): string {
  return `
    <div class="scrbd-tab-bar">
      ${TABS.map(t => {
        const isAi = t.id !== "transcript";
        const disabled = isAi && !aiEnabled;
        const active = t.id === activeTab;
        return `
          <button class="scrbd-tab${active ? " active" : ""}${disabled ? " disabled" : ""}"
            data-tab="${t.id}" ${disabled ? "disabled" : ""}>
            <span class="scrbd-tab-icon">${TAB_ICONS[t.id as string] ?? ""}</span>
            ${t.label}
          </button>
        `;
      }).join("")}
    </div>
  `;
}

export function buildSettingsView(apiKey: string, model: string): string {
  const keyHint = apiKey ? `${apiKey.slice(0, 8)}${"·".repeat(12)}` : "";
  return `
    <div class="scrbd-settings">
      <div class="scrbd-settings-section">
        <div class="scrbd-settings-row stacked">
          <div class="scrbd-settings-row-label">
            <span class="scrbd-settings-row-title">API Key</span>
            <span class="scrbd-settings-row-hint">${keyHint || "Not configured"}</span>
          </div>
          <div class="scrbd-settings-row-control">
            <input type="password" class="scrbd-settings-input" id="scrbd-settings-key"
              placeholder="sk-or-..." value="${escapeAttr(apiKey)}" autocomplete="off" spellcheck="false" />
          </div>
        </div>
        <div class="scrbd-settings-row">
          <div class="scrbd-settings-row-label">
            <span class="scrbd-settings-row-title">Model</span>
          </div>
          <div class="scrbd-settings-row-control">
            <select class="scrbd-settings-select" id="scrbd-settings-model">
              <option value="google/gemini-3-flash-preview"${model === "google/gemini-3-flash-preview" ? " selected" : ""}>Gemini 3 Flash</option>
            </select>
          </div>
        </div>
      </div>
      <div class="scrbd-settings-actions">
        <span class="scrbd-settings-status" id="scrbd-settings-status"></span>
        <div class="scrbd-settings-btns">
          <button class="scrbd-settings-cancel" id="scrbd-settings-close">Cancel</button>
          <button class="scrbd-settings-save" id="scrbd-settings-save">Save</button>
        </div>
      </div>
    </div>
  `;
}

export function buildOnboardingView(): string {
  return `
    <div class="scrbd-onboard">
      <div class="scrbd-onboard-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M9.5 2a.5.5 0 01.5.5c0 2.5 1 4 3.5 4a.5.5 0 010 1C11 7.5 10 9 10 11.5a.5.5 0 01-1 0C9 9 8 7.5 5.5 7.5a.5.5 0 010-1C8 6.5 9 5 9 2.5a.5.5 0 01.5-.5zM17.5 10a.5.5 0 01.5.5c0 1.5.6 2.4 2 2.5a.5.5 0 010 1c-1.4.1-2 1-2 2.5a.5.5 0 01-1 0c0-1.5-.6-2.4-2-2.5a.5.5 0 010-1c1.4-.1 2-1 2-2.5a.5.5 0 01.5-.5zM11.5 16a.5.5 0 01.5.5c0 1.2.5 1.9 1.5 2a.5.5 0 010 1c-1 .1-1.5.8-1.5 2a.5.5 0 01-1 0c0-1.2-.5-1.9-1.5-2a.5.5 0 010-1c1-.1 1.5-.8 1.5-2a.5.5 0 01.5-.5z"/>
        </svg>
      </div>
      <div class="scrbd-onboard-title">Enable AI Features</div>
      <div class="scrbd-onboard-desc">
        Summarize, quiz, and chat with any video transcript. Add your <strong>OpenRouter</strong> API key to get started.
      </div>
      <a class="scrbd-onboard-link" href="https://openrouter.ai/keys" target="_blank" rel="noopener">
        Get your API key
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 1.5h7v7"/><path d="M10.5 1.5L1.5 10.5"/></svg>
      </a>
      <div class="scrbd-onboard-field">
        <input type="password" class="scrbd-onboard-input" id="scrbd-onboard-key"
          placeholder="sk-or-..." autocomplete="off" spellcheck="false" />
      </div>
      <button class="scrbd-onboard-save" id="scrbd-onboard-save">Save & Enable AI</button>
      <div class="scrbd-onboard-status" id="scrbd-onboard-status"></div>
    </div>
  `;
}

export function buildStreamingView(): string {
  return `
    <div class="scrbd-ai-content" id="scrbd-ai-stream">
      <div class="scrbd-ai-loading">
        <div class="scrbd-ai-loading-dot"></div>
        <div class="scrbd-ai-loading-dot"></div>
        <div class="scrbd-ai-loading-dot"></div>
      </div>
    </div>
  `;
}

export function buildChatView(history: ChatMessage[]): string {
  const messages = history.map(m => `
    <div class="scrbd-chat-msg ${m.role}">
      <div class="scrbd-chat-bubble">${formatChatContent(m.content)}</div>
    </div>
  `).join("");

  return `
    <div class="scrbd-chat-messages${history.length === 0 ? " empty" : ""}" id="scrbd-chat-messages">${messages}</div>
    <div class="scrbd-chat-suggestions">
      <button class="scrbd-chat-suggestion" data-suggestion="What is this video about?">What is this video about?</button>
      <button class="scrbd-chat-suggestion" data-suggestion="What are the main takeaways?">Main takeaways?</button>
      <button class="scrbd-chat-suggestion" data-suggestion="List the key timestamps">Key timestamps?</button>
      <button class="scrbd-chat-suggestion" data-suggestion="Explain this video like I'm 5 years old">ELI5</button>
    </div>
    <div class="scrbd-chat-input-bar">
      <input type="text" class="scrbd-chat-input" id="scrbd-chat-input"
        placeholder="Ask about this video..." autocomplete="off" />
      <button class="scrbd-chat-send" id="scrbd-chat-send">→</button>
    </div>
  `;
}

export function buildQuizView(): string {
  return `
    <div class="scrbd-ai-content" id="scrbd-ai-stream">
      <div class="scrbd-ai-loading">
        <div class="scrbd-ai-loading-dot"></div>
        <div class="scrbd-ai-loading-dot"></div>
        <div class="scrbd-ai-loading-dot"></div>
      </div>
    </div>
  `;
}

export function buildQuizCards(questions: QuizQuestion[]): string {
  return `
    <div class="scrbd-quiz-cards">
      ${questions.map((q, i) => `
        <div class="scrbd-quiz-card" data-quiz-index="${i}">
          <div class="scrbd-quiz-question">${i + 1}. ${escapeHtml(q.question)}</div>
          <div class="scrbd-quiz-options">
            ${q.options.map((opt, j) => `
              <button class="scrbd-quiz-option" data-quiz-index="${i}" data-option-index="${j}">
                ${escapeHtml(opt)}
              </button>
            `).join("")}
          </div>
          <div class="scrbd-quiz-explanation" id="scrbd-quiz-explanation-${i}"></div>
        </div>
      `).join("")}
      <button class="scrbd-quiz-regen" id="scrbd-quiz-regen">Generate new quiz</button>
    </div>
  `;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export function buildMarkdownHTML(text: string, model?: string): string {
  // Try structured summary parsing first
  const structured = tryParseSummary(text, model);
  if (structured) return structured;

  // Fallback: generic markdown
  let html = escapeHtml(text);
  html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
  html = html.replace(/\n\n/g, '<br/><br/>');
  html = html.replace(/(<\/h[34]>)<br\/>/g, '$1');
  html = html.replace(/(<\/ul>)<br\/>/g, '$1');
  html = html.replace(/\n/g, '<br/>');
  html = html.replace(/(<\/h[34]>)<br\/>/g, '$1');
  html = html.replace(/(<\/ul>)<br\/>/g, '$1');
  return `<div class="scrbd-ai-prose">${html}</div>`;
}

function tryParseSummary(text: string, model?: string): string | null {
  // Detect TL;DR pattern
  const tldrMatch = text.match(/\*\*TL;?DR:?\*\*:?\s*([\s\S]*?)(?=\n\*\*|$)/i);
  if (!tldrMatch) return null;

  const tldr = tldrMatch[1].trim();

  // Extract sections by **Header:** pattern
  const sections: { title: string; items: string[] }[] = [];
  const sectionRegex = /\*\*([^*]+?):?\*\*:?\s*\n([\s\S]*?)(?=\n\*\*[A-Z]|\n*$)/gi;
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    const title = match[1].trim();
    if (title.toLowerCase().startsWith("tl")) continue;
    const body = match[2].trim();
    const items = body
      .split("\n")
      .map(l => l.replace(/^[\-\*]\s*/, "").trim())
      .filter(Boolean);
    if (items.length > 0) {
      sections.push({ title, items });
    }
  }

  // Build structured HTML
  let html = `<div class="scrbd-ai-structured">`;

  // Summary header with AI badge and model name
  const modelLabel = model ? model.split("/").pop() || model : "";
  html += `<div class="scrbd-ai-summary-header">`;
  html += `<span class="scrbd-ai-badge">AI Generated</span>`;
  if (modelLabel) html += `<span class="scrbd-ai-model">${escapeHtml(modelLabel)}</span>`;
  html += `</div>`;

  html += `<div class="scrbd-ai-tldr">${escapeHtml(tldr)}</div>`;

  for (const section of sections) {
    const isTopics = section.title.toLowerCase().includes("topic");
    html += `<div class="scrbd-ai-section">`;
    html += `<div class="scrbd-ai-section-title">${escapeHtml(section.title)}</div>`;

    if (isTopics) {
      html += `<div class="scrbd-ai-topics">`;
      for (const item of section.items) {
        // Extract just the bold label if pattern is "**Topic:** description"
        const boldMatch = item.match(/^\*\*(.+?):?\*\*:?\s*/);
        const label = boldMatch ? boldMatch[1].trim() : item;
        html += `<span class="scrbd-ai-topic">${escapeHtml(label)}</span>`;
      }
      html += `</div>`;
    } else {
      html += `<ul class="scrbd-ai-points">`;
      for (const item of section.items) {
        let itemHtml = escapeHtml(item);
        itemHtml = itemHtml.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html += `<li>${itemHtml}</li>`;
      }
      html += `</ul>`;
    }

    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

export function formatChatContent(text: string): string {
  let html = escapeHtml(text);
  // Convert timestamps like [2:41] or [1:23:45] into clickable chips
  html = html.replace(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g,
    '<span class="scrbd-ref-chip" data-time="$1">$1</span>');
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Line breaks
  html = html.replace(/\n/g, '<br/>');
  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, "&quot;").replace(/&/g, "&amp;");
}
