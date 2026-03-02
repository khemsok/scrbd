# scrbd

YouTube transcript extractor + AI. Available as a **CLI tool** and a **Chrome extension**.

## Chrome Extension

Adds a transcript panel to every YouTube video with AI features:

- **Transcript** — searchable, clickable timestamps, export in 5 formats
- **Summary** — AI-generated summary with key points and topics
- **Ask AI** — chat with the video transcript, ask questions, get ELI5 explanations
- **Quiz** — auto-generated quiz to test comprehension

AI features use [OpenRouter](https://openrouter.ai) — bring your own API key.

### Install

1. Clone the repo and build:

```bash
git clone https://github.com/khemsok/scrbd.git
cd scrbd
bun install
bun run build:ext
```

2. Open `chrome://extensions`, enable Developer mode
3. Click "Load unpacked" and select the `extension/` directory

## CLI

Get YouTube video transcripts from the command line. No API key needed.

```bash
scrbd https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### Install

```bash
npm install -g @khemsok/scrbd
```

### Usage

```bash
# Get a transcript
scrbd <url>

# Different output formats
scrbd <url> --timestamps        # [MM:SS] prefixed lines
scrbd <url> --json              # structured JSON array
scrbd <url> --md                # markdown with timestamp sections
scrbd <url> --srt               # SRT subtitle format

# Search inside a video
scrbd search <url> "keyword"

# Extract a time range
scrbd clip <url> --from 1:30 --to 5:00

# Multiple videos
scrbd <url1> <url2> <url3>

# Pipe from stdin
cat urls.txt | scrbd --json

# Combine with other tools
scrbd <url> | pbcopy
scrbd <url> --json | jq '.[].text'
scrbd <url> --srt > subtitles.srt
```

Accepts full YouTube URLs, short URLs (`youtu.be/...`), or just the 11-character video ID.

### Options

| Flag | Short | Description |
|------|-------|-------------|
| `--timestamps` | `-t` | Prefix each line with `[MM:SS]` |
| `--json` | `-j` | Output as JSON array |
| `--md` | | Markdown with ~30s section headers |
| `--srt` | | SRT subtitle format |
| `--lang <code>` | `-l` | Caption language (default: English) |
| `--from <time>` | | Clip start time |
| `--to <time>` | | Clip end time |
| `--help` | `-h` | Show help |

## Development

```bash
bun run dev              # Run CLI directly
bun run build            # Build CLI
bun run build:ext        # Build Chrome extension
bun run dev:ext          # Watch mode for extension
```

## Requirements

- Node.js >= 18
- [Bun](https://bun.sh) for building

## License

MIT
