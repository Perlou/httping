# Httping - HTTP 测试工具

<div align="center">

![Httping Logo](public/httping-logo.png)

一个现代化的 HTTP 测试工具，采用 Material Design 3 设计风格。

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange)](https://httping.pages.dev)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

[在线演示](https://41b435af.httping-2bb.pages.dev) | [部署文档](DEPLOYMENT.md) | [功能特性](#功能特性)

</div>

---

## ✨ 功能特性

- 🚀 **HTTP 请求测试** - 支持 GET、POST、PUT、DELETE 等所有 HTTP 方法
- 📊 **响应查看** - 清晰展示 Headers、Body、状态码等详细信息
- 🕐 **请求历史** - 自动保存最近 20 条请求记录
- 🌍 **环境管理** - Development/Production 环境快速切换
- 🔑 **认证支持** - Bearer Token、Basic Auth 等多种认证方式
- 🎨 **Material Design 3** - 现代化界面设计
- ⚡ **快速响应** - 基于 React + Vite 构建
- 🌐 **无需服务器** - 部署到 Cloudflare Pages 完全免费

---

## 📸 截图

> 待添加应用截图

---

## 🚀 快速开始

### 在线使用

无需安装，直接访问：**https://41b435af.httping-2bb.pages.dev**

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/Perlou/httping.git
cd httping

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:1420
```

### 部署到 Cloudflare Pages

```bash
# 一键部署
npm run deploy

# 或查看详细部署文档
cat DEPLOYMENT.md
```

---

## 📦 技术栈

| 技术             | 版本   | 用途        |
| ---------------- | ------ | ----------- |
| **React**        | 19.1.0 | UI 框架     |
| **Vite**         | 7.0.4  | 构建工具    |
| **TypeScript**   | 5.8.3  | 类型系统    |
| **Tailwind CSS** | 3.4.18 | 样式框架    |
| **Axios**        | 1.13.2 | HTTP 客户端 |
| **Zustand**      | 5.0.8  | 状态管理    |
| **Vitest**       | 4.0.10 | 测试框架    |

---

## 🎯 使用指南

### 发送 HTTP 请求

1. 输入请求 URL（例如：`https://httpbin.org/get`）
2. 选择 HTTP 方法（GET/POST/PUT/DELETE 等）
3. （可选）添加请求头、请求体、查询参数
4. 点击 "Send" 按钮
5. 查看响应详情

### 管理请求历史

- 历史记录自动保存在左侧面板
- 点击历史项快速复用请求
- 单独删除不需要的记录
- 最多保存 20 条历史

### 环境变量

1. 配置不同环境（Development/Production）
2. 在 URL 中使用变量：`{{baseUrl}}/api/users`
3. 快速切换环境测试

---

## 🛠️ 开发

### 可用脚本

```bash
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览构建产物
npm test                 # 运行测试
npm run deploy           # 部署到 Cloudflare Pages
npm run deploy:check     # 部署前检查
npm run deploy:dry-run   # 测试构建
```

### 项目结构

```
httping/
├── src/
│   ├── components/      # React 组件
│   ├── hooks/          # 自定义 Hooks
│   ├── store/          # Zustand 状态管理
│   ├── utils/          # 工具函数
│   └── types/          # TypeScript 类型
├── public/             # 静态资源
├── scripts/            # 部署脚本
└── dist/               # 构建输出
```

### 测试

```bash
# 运行所有测试
npm test

# 监听模式
npm test -- --watch

# 测试覆盖率
npm test -- --coverage
```

---

## 🚢 部署

### 方式一：自动化脚本（推荐）

```bash
# 完整部署流程
./deploy.sh

# 或使用 npm
npm run deploy
```

### 方式二：GitHub Actions

推送到 `main` 分支自动部署：

```bash
git push origin main
```

### 方式三：手动部署

```bash
npm run build
wrangler pages deploy dist --project-name=httping
```

📖 查看 [完整部署文档](DEPLOYMENT.md) 了解更多选项和配置。

---

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

### 开发规范

- 遵循 TypeScript 最佳实践
- 编写单元测试
- 保持代码风格一致
- 提交前运行 `npm run deploy:check`

---

## 💖 赞助

如果这个项目对你有帮助，欢迎赞助支持！

在应用中点击 "赞助" 按钮查看支付方式。

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🔗 相关链接

- [GitHub 仓库](https://github.com/Perlou/httping)
- [在线演示](https://41b435af.httping-2bb.pages.dev)
- [部署文档](DEPLOYMENT.md)
- [问题反馈](https://github.com/Perlou/httping/issues)

---

## 📮 联系方式

- GitHub: [@Perlou](https://github.com/Perlou)
- 项目链接: [https://github.com/Perlou/httping](https://github.com/Perlou/httping)

---

<div align="center">

**⭐ 如果觉得有用，请给个 Star！⭐**

Made with ❤️ by [Perlou](https://github.com/Perlou)

</div>
