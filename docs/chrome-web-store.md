# Chrome Web Store Draft

## 中文上架文案

### 扩展名称

AI Pilot Sidebar: ChatGPT, Grok & Gemini

### 简短描述

固定在 Chrome 侧边栏中的轻量多 AI 助手，支持 ChatGPT、Grok、Gemini、豆包、Kimi 等。

### 详细描述

AI Pilot Sidebar 是一个固定在 Chrome 右侧的多 AI 侧边栏工具。

你可以在一个简洁的侧边菜单中快速切换 ChatGPT、Grok、Gemini、豆包、Kimi、Claude、DeepSeek、Copilot 和自定义 AI 网站。扩展会直接打开对应 AI 的官方网站，并复用你当前 Chrome 浏览器中的官网登录状态。

主要功能：

- 使用 Chrome 官方 Side Panel。
- 支持多个 AI 官网快速切换。
- 支持设置默认启动 AI。
- 支持记住上次使用的 AI。
- 支持显示、隐藏和调整 AI 顺序。
- 支持添加自定义 AI 网站。
- 支持中文和英文界面。
- 设置只保存在本机。
- AI 官网无法稳定嵌入时，提供备用打开方式。

隐私定位：

- 不代理 AI 模型。
- 不收集对话内容。
- 不保存第三方账号密码。
- 不出售或共享用户数据。

部分 AI 官网可能会通过安全策略限制 iframe 嵌入，或变更网页加载规则。AI Pilot Sidebar 会提供兼容处理和备用操作，但每个 AI 网站的登录、Cookie 和内容仍由对应官方网站控制。

### 权限说明

`sidePanel`

用于在 Chrome 官方侧边栏中打开 AI Pilot Sidebar。

`storage`

用于保存本地偏好设置，例如默认 AI、上次使用的 AI、显示/隐藏、排序和自定义 AI。

`tabs`

用于在侧边栏嵌入不稳定时，打开 AI 官网标签页或弹窗。

`declarativeNetRequestWithHostAccess`

仅用于可选的嵌入兼容模式，尝试减少部分 AI 官网因 iframe 响应头造成的白屏问题。不会用于收集浏览内容。

AI 官网域名权限

用于在侧边栏中加载支持的 AI 官方网站，并在启用兼容模式时处理这些域名下的加载问题。

### 建议截图

1. 打开 ChatGPT 的侧边栏，并展示 AI 菜单。
2. AI 菜单展示 ChatGPT、Grok、Gemini、豆包、Kimi。
3. 设置页展示默认 AI 和显示/隐藏控制。
4. 自定义 AI 添加表单。
5. 英文界面截图，用于国际用户展示。

### 建议关键词

AI 侧边栏、ChatGPT 侧边栏、Grok 侧边栏、Gemini 侧边栏、多 AI、Chrome 侧边栏、AI 助手、Kimi、豆包、Claude、DeepSeek、Copilot

---

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
