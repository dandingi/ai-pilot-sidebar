# AI Pilot 侧边助手隐私说明

AI Pilot 侧边助手不收集、不出售、不共享用户数据。

## 本地保存的数据

扩展仅在本机 Chrome 的 `chrome.storage.local` 中保存以下设置：

- AI 列表和自定义 AI 入口
- 默认启动 AI
- 是否记住上次使用
- AI 显示/隐藏和排序设置
- 高级嵌入兼容开关

这些数据不会上传到 AI Pilot 的服务器。

## 第三方 AI 网站

用户在侧边栏中打开 ChatGPT、Grok、Gemini、豆包、Kimi、Claude、DeepSeek、Copilot 或自定义 AI 时，实际访问的是对应第三方网站。登录状态、Cookie、对话内容和账号信息由对应第三方网站处理，AI Pilot 不读取、不保存第三方账号密码或对话内容。

## 权限说明

扩展使用 Chrome 官方 Side Panel API 显示固定侧边栏；使用 storage 保存本地设置；高级嵌入兼容模式会在用户启用时尝试改善部分 AI 官网在侧边栏中的加载问题。
