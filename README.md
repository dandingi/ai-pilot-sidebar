# AI Pilot 侧边助手

一个 Manifest V3 Chrome 扩展，使用官方 `chrome.sidePanel` 实现固定右侧多 AI 助手。

## 已实现

- Chrome 官方 Side Panel。
- 侧边栏 AI 菜单：ChatGPT、Grok、Gemini、豆包、Kimi、Claude、DeepSeek、Copilot。
- 内置中文 / 英文界面文案，跟随 Chrome 浏览器语言自动切换。
- 菜单底部提供设置入口。
- 设置默认启动 AI、记住上次使用、显示/隐藏 AI、调整排序。
- 添加自定义 AI，支持侧栏嵌入、新标签页、独立窗口。
- 自定义 AI 和图标图片 URL 仅支持 HTTPS。
- AI 网页不能嵌入时，提供复制 Prompt 和打开官网的备用路径。
- “高级嵌入兼容模式”：针对部分 AI 官网尝试移除阻止 iframe 的响应头，默认开启，可在设置中关闭。

## 使用方式

1. 打开 Chrome 的 `chrome://extensions/`。
2. 开启“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择本目录：`E:\项目\浏览器扩展ai`。
5. 将扩展图标钉在工具栏，点击图标打开侧边栏。

## 注意

部分 AI 官网会通过浏览器安全策略阻止 iframe 嵌入。AI Pilot 不会接管登录或保存第三方账号密码，遇到无法嵌入的网站时会显示备用操作。

“高级嵌入兼容模式”默认开启。它会使用 `declarativeNetRequestWithHostAccess` 针对常见 AI 域名尝试移除 `X-Frame-Options` 和 `Content-Security-Policy` 响应头。它可以改善部分白屏问题，但不保证所有登录流程和站点都可嵌入。

登录状态依赖 Chrome 当前用户资料中的官方网页登录 Cookie。也就是说，如果你已经在同一个 Chrome 浏览器里登录过 Grok、ChatGPT、豆包、Kimi 等官网，侧边栏加载同一官网时通常会自动复用登录状态。

扩展不收集、不上传用户的浏览记录、网页内容、账号密码或第三方 AI 对话内容。设置和自定义 AI 列表保存在本机 `chrome.storage.local` 中。
