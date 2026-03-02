# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

scrbd is a zero-dependency YouTube transcript extractor available as both a **CLI tool** (npm package `@khemsok/scrbd`) and a **Chrome extension**. It uses YouTube's undocumented InnerTube API to fetch captions without requiring an API key from the user.

## Build Commands

```bash
# CLI
bun run dev                  # Run CLI directly (no build step)
bun run build                # Build CLI to dist/cli.js (Node.js target)

# Chrome Extension
bun run build:ext            # Build all 3 extension scripts to extension/dist/
bun run dev:ext              # Watch mode for extension development

# After building extension, load unpacked from extension/ dir in chrome://extensions
```

## Architecture

### Two Independent Codebases, Duplicated Core

The CLI (`src/`) and extension (`extension/src/`) intentionally duplicate core logic rather than sharing it. This avoids cross-platform build complexity but means changes to transcript fetching or formatting must be applied in both places.

- **CLI core**: `src/transcript.ts`, `src/utils/format.ts`
- **Extension core**: `extension/src/core/transcript.ts`, `extension/src/core/format.ts`
- Key difference: CLI's `getTranscript()` fetches the API key internally; extension's version receives it as a parameter.

### CLI (`src/`)

Entry point `src/cli.ts` dispatches to three subcommands: `transcript` (default), `search`, `clip`. Custom arg parser in `src/utils/args.ts` (no external deps). Supports stdin piping for batch URL processing.

### Extension (`extension/src/`)

Three-script Chrome Extension (Manifest V3):

1. **Content script** (`content/content.ts`) — Main logic. Injects a Shadow DOM transcript panel into YouTube pages. Handles two distinct layouts:
   - **Watch pages**: Collapsible panel prepended to `#secondary-inner` sidebar
   - **Shorts pages**: Action column button + fixed-position popover on `document.body`

2. **Inject script** (`content/inject.ts`) — Tiny script injected into page's main world to extract `ytcfg.data_.INNERTUBE_API_KEY` via `window.postMessage` bridge.

3. **Service worker** (`background/service-worker.ts`) — Minimal; sends `SCRBD_TOGGLE` message on icon click.

### Key Extension Patterns

- **Shadow DOM isolation**: All panel styles live in `content/styles.ts` as a template literal, injected into the shadow root. CSS variables support dark/light themes synced to YouTube's `html[dark]` attribute via MutationObserver.
- **YouTube SPA handling**: Listens for `yt-navigate-finish` window event to detect navigation, then re-injects panel for new video.
- **Format type**: `type Format = "plain" | "timestamps" | "json" | "markdown" | "srt"` with centralized `CODE_FORMATS` and `EXT_MAP` constants.
- **Event cleanup**: Document-level listeners and MutationObservers are tracked and removed in `removePanel()` to prevent leaks across SPA navigations.
- **Keyboard isolation**: Search input stops propagation on key events to prevent triggering YouTube shortcuts (f=fullscreen, k=pause, etc.).

### InnerTube API Flow

1. Extract API key from YouTube page context (`ytcfg.data_.INNERTUBE_API_KEY`)
2. POST to `youtube.com/youtubei/v1/player?key=<key>` with Android client context
3. Parse caption track list from response
4. Fetch selected track's XML caption URL
5. Parse XML entries into `{ text, start, duration }` objects

## Type Definitions

```typescript
type TranscriptEntry = { text: string; start: number; duration: number };
type CaptionTrack = { baseUrl: string; languageCode: string; name: string; kind?: string };
```

## Conventions

- **Zero runtime dependencies** — uses only native Node.js/browser APIs
- **Bun** for building, running, and package management
- **ESM only** (`"type": "module"`)
- **No unnecessary comments** — code should be self-explanatory. Only add comments where the logic is non-obvious or there's important context that can't be expressed in code.
- Output formats: plain text, timestamped, JSON, markdown (30s sections), SRT
