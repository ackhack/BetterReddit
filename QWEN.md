# Better Reddit — Project Context

## Project Overview

**Better Reddit** is a Chrome Extension (Manifest V3) that provides a custom, keyboard-driven Reddit browsing experience using the official Reddit API. It renders posts as a centered, scrollable feed with a dark theme and supports inline media viewing (images, galleries, videos, audio, iframes).

### Key Features
- **Keyboard navigation**: Full keyboard-driven browsing (arrow keys, enter, escape, space, m for mute)
- **Post detail view**: Expand any post into a fullscreen-like article view with nested comments
- **Gallery slideshow**: Navigate multi-image gallery posts with left/right arrows
- **Upvote/downvote**: Inline voting with visual feedback (orange for upvote, lightblue for downvote)
- **Media support**: Videos, images, galleries, audio, and embedded iframes
- **Comment threading**: Nested comment trees rendered with indentation
- **Notification toasts**: Non-intrusive notification popups for status updates

### Architecture

```
manifest.json          ← MV3 manifest: service worker + popup action
serviceWorker.js       ← Background worker: serves secrets.json to content
popup.html/js          ← Tiny popup: opens the main page in a new tab
page/
  ├── betterreddit.html  ← Main SPA shell (header + post list + article view)
  ├── betterreddit.css   ← Dark theme, centered layout, custom controls
  ├── libs/
  │   └── snoowrap-v1.min.js  ← Reddit API client (snoowrap, password grant flow)
  └── js/
      ├── init.js        ← App bootstrap: loads secrets, auth, header, first posts
      ├── generic.js       ← Shared state: postArray, api, username, logging, scroll helpers
      ├── votes.js         ← Upvote/downvote UI + API calls with local vote tracking
      ├── galleries.js     ← Image slideshow with prev/next navigation
      ├── mainArticle.js   ← Full post detail view + comment tree rendering
      ├── keyListener.js   ← Centralized keyboard shortcut system (config-driven)
      ├── notifications.js ← Toast notification system
      ├── scroll.js        ← Scroll handling / infinite load
      ├── posts.js         ← Post rendering / feed loading
      ├── settings.js      ← User settings persistence via chrome.storage
      └── player.js        ← Video/audio player wrapper with custom controls
```

### Data Flow
1. **Auth**: `popup.js` → `serviceWorker.js` reads `secrets.json` → returns credentials via `chrome.runtime.sendMessage`
2. **API**: `snoowrap` uses Reddit's **password grant** flow (`clientId`, `clientSecret`, `username`, `password`)
3. **Rendering**: Posts fetched → rendered as `.post` elements → active post highlighted with green border
4. **Detail view**: Click/Enter → content moves from feed to `#mainArticle` div → comments loaded recursively

## Prerequisites

- **Chrome/Chromium-based browser** (Manifest V3)
- **Reddit app credentials** (Client ID + Client Secret) from [Reddit app preferences](https://www.reddit.com/prefs/apps)
- **Reddit username + password** (password grant flow — never share `secrets.json`)

## Setup & Running

1. **Rename secrets template**:
   ```bash
   cp secrets_template.json secrets.json
   ```
2. **Fill in credentials** in `secrets.json`:
   ```json
   {
     "clientId": "YOUR_CLIENT_ID",
     "clientSecret": "YOUR_CLIENT_SECRET",
     "username": "YOUR_REDDIT_USERNAME",
     "password": "YOUR_REDDIT_PASSWORD"
   }
   ```
3. **Load in browser**:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select this directory

## Keyboard Controls

| Key | Action (Feed) | Action (Article View) |
|-----|---------------|----------------------|
| `↑` | Upvote | Ctrl+↑: Close article |
| `↓` | Downvote | — |
| `←` | Previous post | Ctrl+←: Gallery prev |
| `→` | Next post | Ctrl+→: Gallery next |
| `Enter` | Open post fullscreen | — |
| `Escape` | — | Close article |
| `Space` | Pause/play video | Pause/play video |
| `M` | Mute/unmute video | Mute/unmute video |

## Key Files

| File | Purpose |
|------|---------|
| `secrets_template.json` | Template for Reddit API credentials (never commit real `secrets.json`) |
| `serviceWorker.js` | Background worker that securely serves secrets to the content page |
| `page/js/init.js` | App entry point — initializes auth, header, and feeds first posts |
| `page/js/keyListener.js` | Config-driven keyboard shortcut system with key cooldowns (500ms) |
| `page/js/mainArticle.js` | Post detail view with recursive comment tree rendering |
| `page/js/galleries.js` | Image slideshow for gallery posts (prev/next + slide counter) |
| `page/js/votes.js` | Vote tracking + UI state + snoowrap API calls |

## Development Notes

- **Single-page app**: The entire UI lives in `page/betterreddit.html` with modular JS files
- **No build step**: Pure vanilla JS, CSS, and HTML — no framework, no bundler
- **Global state**: Variables like `postArray`, `api`, `username`, `currDisplay` are global (no module system)
- **CSS**: All styling is in `page/betterreddit.css` (~300 lines), dark theme (`#333` background)
- **snoowrap**: Bundled as `libs/snoowrap-v1.min.js` — pinned version, no npm dependency management
- **Secrets loading**: `secrets.json` is served via `chrome.runtime.getURL()` from the service worker for security
- **Key cooldowns**: 500ms cooldown between repeated keypresses to prevent runaway API calls
- **scrollIntoView**: Uses `block: "center"` if setting `scrollMiddle` is enabled, otherwise standard scroll with offset

## Git History Notes

Recent commits (at snapshot):
- Visual improvements for vertical screens
- Audio/video fixes
- General updates
