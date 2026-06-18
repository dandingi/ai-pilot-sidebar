# AI Pilot Sidebar

AI Pilot Sidebar is a lightweight Chrome extension that keeps multiple official AI websites in a fixed Chrome side panel.

It is designed for people who already use ChatGPT, Grok, Gemini, Doubao, Kimi and other AI tools in the browser, and want a clean way to switch between them without leaving the current page.

中文简介：AI Pilot Sidebar 是一个固定在 Chrome 右侧的轻量多 AI 侧边栏工具，支持 ChatGPT、Grok、Gemini、豆包、Kimi、Claude、DeepSeek、Copilot 和自定义 AI。

## Highlights

- Official Chrome Side Panel, not a floating web overlay.
- Switch between multiple AI websites from a compact side menu.
- Use your own official AI accounts and browser login state.
- Set a default AI or remember the last used AI.
- Show, hide and reorder built-in AI entries.
- Add custom AI websites with name, URL, icon text and optional icon URL.
- Chinese and English UI, following the browser language.
- Local-first settings with `chrome.storage.local`.
- Fallback actions when a website cannot be embedded reliably.

## Supported AI Websites

- ChatGPT
- xAI Grok
- Google Gemini
- Doubao
- Kimi
- Claude
- DeepSeek
- Microsoft Copilot
- Custom AI websites

## Privacy

AI Pilot Sidebar does not operate an AI proxy and does not collect conversations, passwords or browsing history.

The extension opens the official AI websites directly. Login state, cookies, conversations and account data are handled by the corresponding third-party AI websites.

Settings such as AI list, default AI, visibility and custom AI entries are stored locally in Chrome.

See [PRIVACY.md](./PRIVACY.md) for details.

## Permissions

AI Pilot Sidebar requests only the permissions needed for its core behavior:

- `sidePanel`: opens the extension in Chrome's official side panel.
- `storage`: saves local user preferences.
- `tabs`: opens official AI websites in a new tab or popup when needed.
- `declarativeNetRequestWithHostAccess`: optional compatibility mode for reducing iframe blank-page issues on selected AI websites.
- Host permissions for supported AI websites: allow those official websites to load inside the side panel and apply compatibility handling when enabled.

## Install Locally

1. Open `chrome://extensions/` in Chrome.
2. Enable Developer mode.
3. Click "Load unpacked".
4. Select this project folder.
5. Pin the extension icon and click it to open the side panel.

## Development Notes

This is a Manifest V3 extension. There is no build step at the moment.

Main files:

- `manifest.json`: extension manifest and permissions.
- `sidepanel.html`: side panel shell.
- `src/sidepanel.js`: AI list, settings and side panel behavior.
- `src/background.js`: Side Panel setup and compatibility rules.
- `src/ai-frame-cleaner.js`: optional compatibility helper for selected AI sites.
- `_locales/`: Chinese and English UI strings.
- `assets/icons/`: extension and AI icons.

## Chrome Web Store Positioning

Suggested listing title:

```text
AI Pilot Sidebar: ChatGPT, Grok & Gemini
```

Short description:

```text
A lightweight Chrome side panel for ChatGPT, Grok, Gemini, Doubao, Kimi and more.
```

Core positioning:

```text
Use your own official AI accounts in a fixed Chrome side panel. No AI proxy, no conversation collection, no account password storage.
```

## License

No open-source license has been selected yet. All rights reserved unless a license is added later.
