# Chrome Web Store Draft

## Extension Name

AI Pilot Sidebar: ChatGPT, Grok & Gemini

## Short Description

A lightweight Chrome side panel for ChatGPT, Grok, Gemini, Doubao, Kimi and more.

## Detailed Description

AI Pilot Sidebar gives you a clean, fixed Chrome side panel for switching between multiple official AI websites.

Use ChatGPT, Grok, Gemini, Doubao, Kimi, Claude, DeepSeek, Copilot and custom AI websites from one compact side menu. The extension uses your existing browser login state from the official websites, so you can continue using your own accounts.

Key features:

- Fixed Chrome Side Panel powered by the official `chrome.sidePanel` API.
- Quick AI switching from a compact side menu.
- Default AI setting and optional "remember last used" behavior.
- Show, hide and reorder AI entries.
- Add custom AI websites.
- Chinese and English UI.
- Local-only settings.
- Fallback actions when a website cannot be embedded reliably.

Privacy-first positioning:

- No AI proxy.
- No conversation collection.
- No account password storage.
- No selling or sharing user data.

Some AI websites may block iframe embedding or change their web security policies. AI Pilot Sidebar provides compatibility handling and fallback actions, but each AI website's login, cookies and content remain controlled by that official website.

## Permission Explanation

`sidePanel`

Used to open AI Pilot Sidebar in Chrome's official side panel.

`storage`

Used to save local preferences, including default AI, last used AI, visibility, order and custom AI entries.

`tabs`

Used to open an AI website in a normal browser tab or popup when side panel embedding is not reliable.

`declarativeNetRequestWithHostAccess`

Used only for optional embedding compatibility on supported AI websites. It helps reduce blank pages caused by iframe-related response headers. It is not used to collect browsing content.

Host permissions for AI websites

Used to load the supported official AI websites in the side panel and apply optional compatibility handling on those domains.

## Suggested Screenshots

1. Side panel showing ChatGPT with the AI menu open.
2. AI menu showing ChatGPT, Grok, Gemini, Doubao and Kimi.
3. Settings page showing default AI and AI visibility controls.
4. Custom AI form.
5. English UI screenshot for international listing support.

## Suggested Tags / Keywords

AI sidebar, ChatGPT sidebar, Grok sidebar, Gemini sidebar, multi AI, side panel, AI assistant, Kimi, Doubao, Claude, DeepSeek, Copilot
