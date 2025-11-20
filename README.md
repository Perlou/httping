# Httping

<div align="center">

一个现代化的 HTTP 请求测试工具。

[![Deploy](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)](https://perlou-httping.pages.dev)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)](https://github.com/Perlou/httping)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**[在线体验](https://perlou-httping.pages.dev)**

</div>

---

## 功能特性

- 🚀 支持所有 HTTP 方法（GET、POST、PUT、DELETE 等）
- 📊 响应详情展示（Headers、Body、状态码）
- 🕐 请求历史管理（最多 20 条）
- 🌍 环境变量支持（Development/Production）
- 🔑 认证支持（Bearer Token、Basic Auth）
- 🎨 Material Design 3 界面
- ⚡ 零成本部署到 Cloudflare Pages

---

## 快速开始

### 在线使用

访问 **https://perlou-httping.pages.dev**

### 本地开发

```bash
git clone https://github.com/Perlou/httping.git
cd httping
npm install
npm run dev
```

访问 http://localhost:1420

### 部署

```bash
npm run deploy
```

详见 [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 技术栈

- React 19 + TypeScript 5.8
- Vite 7 + Tailwind CSS 3
- Zustand + Axios
- Cloudflare Pages

---

## 使用说明

1. **发送请求**: 输入 URL，选择方法，点击 Send
2. **查看响应**: 查看 Headers、Body、状态等
3. **历史记录**: 左侧面板查看最近请求
4. **环境变量**: 在 URL 中使用 `{{变量名}}`

**快捷键**:

- `Ctrl/Cmd + Enter` - 发送请求
- `Ctrl/Cmd + K` - 聚焦 URL 输入
- `?` - 显示帮助

---

## 开发

```bash
npm run dev              # 开发服务器
npm run build            # 生产构建
npm test                 # 运行测试
npm run deploy           # 部署到 Cloudflare
```

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

<div align="center">

Made with ❤️ by [Perlou](https://github.com/Perlou)

⭐ 如果有帮助，请给个 Star！

</div>
