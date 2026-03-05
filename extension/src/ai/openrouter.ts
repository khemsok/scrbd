export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: Error) => void;
}

export function streamChat(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  callbacks: StreamCallbacks,
): AbortController {
  const controller = new AbortController();

  (async () => {
    let fullText = "";
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    let streamDone = false;
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/khemsok/scrbd",
          "X-Title": "scrbd",
        },
        body: JSON.stringify({ model, messages, stream: true }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(res.status === 401 ? "Invalid API key" : `OpenRouter error ${res.status}: ${body}`);
      }

      reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") { streamDone = true; continue; }

          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) {
              fullText += token;
              callbacks.onToken(token);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      if (streamDone) callbacks.onDone(fullText);
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") {
        reader?.cancel().catch(() => {});
        return;
      }
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      reader?.cancel().catch(() => {});
    }
  })();

  return controller;
}
