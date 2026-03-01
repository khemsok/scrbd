export type Command = "transcript" | "search" | "clip";

export type CliOptions = {
  command: Command;
  urls: string[];
  query: string | undefined;
  timestamps: boolean;
  json: boolean;
  md: boolean;
  srt: boolean;
  lang: string | undefined;
  from: string | undefined;
  to: string | undefined;
  help: boolean;
};

const HELP_TEXT = `
scrbd — get YouTube video transcripts from the command line.
No API key needed. Works with any public video that has captions.

Accepts: full YouTube URLs, short URLs (youtu.be), or just the 11-char video ID.

Commands:
  scrbd <url>                              get full transcript (default)
  scrbd search <url> "query"               find where something was said
  scrbd clip <url> --from 1:30 --to 5:00   extract a specific time range

Output formats:
  (default)                                plain text, one line per caption segment
  --timestamps, -t                         each line prefixed with [MM:SS]
  --json, -j                               array of { text, start, duration } objects
  --md                                     markdown grouped into ~30s sections with ## [MM:SS] headers
  --srt                                    SRT subtitle format (index, timecodes, text)

Options:
  --lang <code>, -l <code>                 caption language (default: English). e.g. es, fr, ja
  --from <time>                            start time for clip (MM:SS or HH:MM:SS)
  --to <time>                              end time for clip (MM:SS or HH:MM:SS)
  --help, -h                               show this help

Multiple videos:
  scrbd <url1> <url2> <url3>               transcribe multiple videos (separated by --- headers)
  echo "<url>" | scrbd                     read URLs from stdin (one per line)
  cat urls.txt | scrbd --json              batch process from file

Output behavior:
  - Plain text outputs one caption segment per line
  - --json returns [{ "text": "...", "start": 0.0, "duration": 1.5 }, ...]
  - search returns matching segments with surrounding context and timestamps
  - search --json returns [{ "timestamp": 0.0, "match": "...", "context": [...] }, ...]
  - Multiple URLs are separated by "--- <url> ---" headers
  - All output goes to stdout. Errors go to stderr.
  - Exit code 0 on success, 1 on error.

Examples:
  scrbd https://www.youtube.com/watch?v=dQw4w9WgXcQ
  scrbd dQw4w9WgXcQ --md
  scrbd dQw4w9WgXcQ --json | jq '.[].text'
  scrbd search dQw4w9WgXcQ "never gonna give"
  scrbd clip dQw4w9WgXcQ --from 0:30 --to 1:00 --srt
  scrbd dQw4w9WgXcQ --srt > subtitles.srt
  scrbd dQw4w9WgXcQ | pbcopy
`.trim();

export function printHelp(): void {
  console.log(HELP_TEXT);
}

export function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    command: "transcript",
    urls: [],
    query: undefined,
    timestamps: false,
    json: false,
    md: false,
    srt: false,
    lang: undefined,
    from: undefined,
    to: undefined,
    help: false,
  };

  let positionals: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    switch (arg) {
      case "--help":
      case "-h":
        options.help = true;
        break;
      case "--timestamps":
      case "-t":
        options.timestamps = true;
        break;
      case "--json":
      case "-j":
        options.json = true;
        break;
      case "--md":
        options.md = true;
        break;
      case "--srt":
        options.srt = true;
        break;
      case "--lang":
      case "-l":
        if (i + 1 >= argv.length) throw new Error("--lang requires a value");
        options.lang = argv[++i];
        break;
      case "--from":
        if (i + 1 >= argv.length) throw new Error("--from requires a value");
        options.from = argv[++i];
        break;
      case "--to":
        if (i + 1 >= argv.length) throw new Error("--to requires a value");
        options.to = argv[++i];
        break;
      default:
        if (!arg.startsWith("-")) {
          positionals.push(arg);
        }
        break;
    }
  }

  // Parse positionals based on subcommand
  if (positionals[0] === "search" || positionals[0] === "clip") {
    options.command = positionals[0] as Command;
    options.urls = positionals[1] ? [positionals[1]] : [];
    if (options.command === "search") {
      options.query = positionals[2];
    }
  } else {
    options.urls = positionals;
  }

  return options;
}
