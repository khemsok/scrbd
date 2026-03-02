export function summaryPrompt(transcript: string): string {
  return `You are a transcript summarizer. Analyze the following YouTube video transcript and provide a structured summary.

Format your response EXACTLY like this:
**TL;DR:** [1-2 sentence overview]

**Key Points:**
- [point 1]
- [point 2]
- [point 3]
- [more if needed]

**Topics Covered:**
- [topic 1]
- [topic 2]
- [topic 3]

Transcript:
${transcript}`;
}

export function eli5Prompt(transcript: string): string {
  return `Explain the content of this YouTube video transcript like I'm 5 years old. Use simple words, fun analogies, and short sentences. Keep it engaging and easy to understand.

Transcript:
${transcript}`;
}

export function quizPrompt(transcript: string): string {
  return `Based on this YouTube video transcript, create a quiz with 5 multiple-choice questions. Return ONLY valid JSON in this exact format, no other text:

[
  {
    "question": "What is...?",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correct": 0,
    "explanation": "Brief explanation"
  }
]

Transcript:
${transcript}`;
}

export function translatePrompt(transcript: string, language: string): string {
  return `Translate the following YouTube video transcript into ${language}. Maintain the original meaning and tone. Provide only the translation, no additional commentary.

Transcript:
${transcript}`;
}

export function chatSystemPrompt(transcript: string): string {
  return `You are a helpful assistant that answers questions about a YouTube video. Use the transcript below as your knowledge base. When referencing specific moments, include timestamps in the format [M:SS] or [H:MM:SS]. Keep responses concise and relevant.

Transcript:
${transcript}`;
}
