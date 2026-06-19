# AI Pilot Sidebar

固定在 Chrome 右侧的轻量多 AI 侧边栏工具，支持常用 AI 官网和自定义 AI 网站。

AI Pilot Sidebar 适合已经在浏览器里使用多个 AI 官网的用户。它不会代理模型，也不会接管账号登录，而是把你自己的官方 AI 账号放进一个固定、干净的 Chrome Side Panel 中，方便快速切换。

## 功能亮点

- 使用 Chrome 官方 `sidePanel`，是真正固定在浏览器右侧的侧边栏。
- 支持多个常用 AI 官网快速切换。
- 支持添加自定义 AI 网站。
- 支持设置默认启动 AI。
- 支持记住上次使用的 AI。
- 支持显示、隐藏和调整 AI 顺序。
- 支持中文 / 英文界面，跟随 Chrome 浏览器语言自动切换。
- 登录状态复用当前 Chrome 浏览器中的官网 Cookie。
- 设置保存在本机 `chrome.storage.local`。
- AI 官网无法稳定嵌入时，提供备用打开方式。

## 支持范围

AI Pilot Sidebar 内置多个常用 AI 官网入口，并支持添加自定义 AI 网站。内置入口可在设置中显示、隐藏和排序。

## 隐私说明

AI Pilot Sidebar 不运营 AI 代理服务，不收集用户对话，不保存第三方 AI 账号密码，也不上传浏览记录。

扩展打开的是对应 AI 的官方网站。登录状态、Cookie、对话内容和账号数据由对应第三方 AI 网站处理。

扩展只在本机保存以下设置：

- AI 列表
- 默认 AI
- 是否记住上次使用
- AI 显示/隐藏和排序
- 自定义 AI 入口
- 高级嵌入兼容开关

详细说明见 [PRIVACY.md](./PRIVACY.md)。

## 权限说明

- `sidePanel`：用于打开 Chrome 官方侧边栏。
- `storage`：用于保存本地设置。
- `declarativeNetRequestWithHostAccess`：用于可选的嵌入兼容模式，尝试减少部分 AI 官网在侧边栏中白屏的问题。
- AI 官网域名权限：用于在侧边栏中加载对应官方网站，并在启用兼容模式时处理相关加载问题。

## 本地安装

1. 打开 Chrome 的 `chrome://extensions/`。
2. 开启“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择本项目目录。
5. 将扩展图标固定到工具栏，点击图标打开侧边栏。

## 项目结构

- `manifest.json`：Chrome 扩展配置和权限。
- `sidepanel.html`：侧边栏页面结构。
- `src/sidepanel.js`：AI 列表、设置和侧边栏交互。
- `src/background.js`：Side Panel 初始化和兼容规则。
- `src/ai-frame-cleaner.js`：可选的 AI 页面兼容辅助脚本。
- `_locales/`：中文和英文界面文案。
- `assets/icons/`：扩展图标和 AI 图标。
- `docs/chrome-web-store.md`：Chrome 应用商店上架文案草稿。

## License

暂未选择开源许可证。除非后续添加许可证，否则保留所有权利。

---

## English

AI Pilot Sidebar is a lightweight Chrome extension that keeps multiple official AI websites in a fixed Chrome side panel.

It is designed for people who already use multiple AI websites in the browser and want a clean way to switch between them without leaving the current page.

### Highlights

- Official Chrome Side Panel, not a floating web overlay.
- Switch between multiple AI websites from a compact side menu.
- Use your own official AI accounts and browser login state.
- Set a default AI or remember the last used AI.
- Show, hide and reorder built-in AI entries.
- Add custom AI websites.
- Chinese and English UI, following the browser language.
- Local-first settings with `chrome.storage.local`.
- Fallback actions when a website cannot be embedded reliably.

### Privacy

AI Pilot Sidebar does not operate an AI proxy and does not collect conversations, passwords or browsing history.

The extension opens the official AI websites directly. Login state, cookies, conversations and account data are handled by the corresponding third-party AI websites.

### Install Locally

1. Open `chrome://extensions/` in Chrome.
2. Enable Developer mode.
3. Click "Load unpacked".
4. Select this project folder.
5. Pin the extension icon and click it to open the side panel.
