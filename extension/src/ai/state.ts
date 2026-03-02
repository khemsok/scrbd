export type AiView = "summary" | "chat" | "quiz" | null;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AiState {
  currentView: AiView;
  cache: Map<string, string>;
  chatHistory: ChatMessage[];
  activeController: AbortController | null;
}

const state: AiState = {
  currentView: null,
  cache: new Map(),
  chatHistory: [],
  activeController: null,
};

export function getAiState() {
  return state;
}

export function setAiView(view: AiView) {
  state.currentView = view;
}

export function getCached(key: string): string | undefined {
  return state.cache.get(key);
}

export function setCache(key: string, value: string) {
  state.cache.set(key, value);
}

export function addChatMessage(msg: ChatMessage) {
  state.chatHistory.push(msg);
}

export function getChatHistory(): ChatMessage[] {
  return state.chatHistory;
}

export function setActiveController(ctrl: AbortController | null) {
  state.activeController = ctrl;
}

export function abortActiveRequest() {
  if (state.activeController) {
    state.activeController.abort();
    state.activeController = null;
  }
}

export function resetAiState() {
  state.currentView = null;
  state.cache.clear();
  state.chatHistory = [];
  abortActiveRequest();
}
