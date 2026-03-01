# scrbd

Get YouTube video transcripts from the command line. No API key needed.

```bash
scrbd https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

## Install

```bash
bun add -g @khemsok/scrbd
```

Or clone and link locally:

```bash
git clone https://github.com/khemsok/scrbd.git
cd scrbd
bun install
bun link
```

## Usage

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

## Output Formats

### Plain text (default)

```
Back to the NFL with more burning
questions as the combine continues. The
Cardinals general manager is Monti
```

### Timestamps (`--timestamps`)

```
[00:00] Back to the NFL with more burning
[00:01] questions as the combine continues. The
[00:04] Cardinals general manager is Monti
```

### JSON (`--json`)

```json
[
  { "text": "Back to the NFL with more burning", "start": 0.08, "duration": 4.08 },
  { "text": "questions as the combine continues.", "start": 1.76, "duration": 4.079 }
]
```

### Markdown (`--md`)

```markdown
## [00:00]

Back to the NFL with more burning questions as the combine continues.
The Cardinals general manager is Monti Oenfort.

## [00:31]

He says trade talks are open for Kyler Murray and he has not yet
spoken to the quarterback this off season.
```

### SRT (`--srt`)

```
1
00:00:00,080 --> 00:00:04,160
Back to the NFL with more burning

2
00:00:01,760 --> 00:00:05,839
questions as the combine continues. The
```

## Commands

### `scrbd search <url> "query"`

Find where something was said. Returns matching segments with surrounding context and timestamps.

```bash
$ scrbd search dQw4w9WgXcQ "give you up"
[00:43] Never gonna give you up never gonna let you down
```

Use `--json` for structured results:

```json
[
  {
    "timestamp": 43.2,
    "match": "Never gonna give you up",
    "context": [
      { "text": "We're no strangers to love", "start": 40.1 },
      { "text": "Never gonna give you up", "start": 43.2 },
      { "text": "never gonna let you down", "start": 45.8 }
    ]
  }
]
```

### `scrbd clip <url> --from <time> --to <time>`

Extract a specific time range from the transcript. Times can be `MM:SS` or `HH:MM:SS`.

```bash
scrbd clip dQw4w9WgXcQ --from 0:30 --to 1:00
scrbd clip dQw4w9WgXcQ --from 0:30 --to 1:00 --srt
```

## Options

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

## Requirements

- [Bun](https://bun.sh) >= 1.0

## License

MIT
