# Httping 部署文档

本文档详细说明如何将 Httping HTTP 测试工具部署到 Cloudflare Pages。

## 目录

- [项目概述](#项目概述)
- [部署架构](#部署架构)
- [前置条件](#前置条件)
- [部署方式](#部署方式)
  - [方式一：使用 Wrangler CLI（推荐）](#方式一使用-wrangler-cli推荐)
  - [方式二：GitHub 自动部署](#方式二github-自动部署)
- [配置说明](#配置说明)
- [环境变量](#环境变量)
- [自定义域名](#自定义域名)
- [性能优化](#性能优化)
- [故障排查](#故障排查)
- [监控和分析](#监控和分析)
- [成本说明](#成本说明)

---

## 项目概述

Httping 是一个基于 React + Vite 构建的 HTTP 测试工具，支持：

- 发送 HTTP/HTTPS 请求
- 查看响应详情（Headers、Body、状态码等）
- 请求历史管理
- 环境变量支持
- Material Design 3 风格界面

### 技术栈

- **前端框架**: React 19.1.0
- **构建工具**: Vite 7.0.4
- **样式方案**: Tailwind CSS 3.4.18
- **HTTP 客户端**: Axios 1.13.2
- **状态管理**: Zustand 5.0.8
- **托管平台**: Cloudflare Pages

---

## 部署架构

```
┌─────────────────┐
│   源代码仓库     │
│   (本地/GitHub)  │
└────────┬────────┘
         │
         │ npm run build
         ▼
┌─────────────────┐
│   dist/         │
│   (构建产物)     │
└────────┬────────┘
         │
         │ wrangler deploy
         ▼
┌─────────────────┐
│ Cloudflare Pages│
│   + CDN         │
│   + SSL/TLS     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   最终用户      │
│   (浏览器访问)   │
└─────────────────┘
```

---

## 前置条件

### 必需条件

1. **Node.js 环境**

   - 推荐版本: Node.js 18+ / 20+
   - 检查版本: `node --version`

2. **npm 包管理器**

   - 通常随 Node.js 一起安装
   - 检查版本: `npm --version`

3. **Cloudflare 账号**
   - 注册地址: https://dash.cloudflare.com/sign-up
   - 完全免费，无需信用卡

### 可选条件

- **Git**: 用于版本控制和 GitHub 集成
- **GitHub 账号**: 如果使用自动部署方式

---

## 部署方式

### 方式一：使用 Wrangler CLI（推荐）

这是最快速、最直接的部署方式。

#### 步骤 1: 安装依赖

```bash
# 进入项目目录
cd /path/to/httping

# 安装项目依赖
npm install

# 全局安装 Wrangler CLI
npm install -g wrangler
```

#### 步骤 2: 登录 Cloudflare

```bash
# 登录到 Cloudflare 账号
wrangler login
```

这会打开浏览器窗口，按照提示完成授权。

#### 步骤 3: 构建项目

```bash
# 构建生产版本
npm run build
```

构建成功后，会在 `dist/` 目录生成以下文件：

- `index.html` - 主页面
- `assets/` - CSS 和 JavaScript 资源
- 图片和其他静态资源

#### 步骤 4: 部署到 Cloudflare Pages

```bash
# 首次部署
wrangler pages deploy dist --project-name=httping

# 后续部署（如果有未提交的 git 更改）
wrangler pages deploy dist --project-name=httping --commit-dirty=true
```

部署过程中，系统会询问：

1. **是否创建新项目**: 选择 "Create a new project"
2. **生产分支名称**: 输入 `main` 或你的主分支名

#### 步骤 5: 获取部署 URL

部署成功后，终端会显示访问 URL，例如：

```
✨ Deployment complete! Take a peek over at https://xxxxx.httping-xxx.pages.dev
```

---

### 方式二：GitHub 自动部署

通过 GitHub 集成实现自动化部署，每次推送代码自动触发部署。

#### 步骤 1: 推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/yourusername/httping.git

# 推送到 GitHub
git push -u origin main
```

#### 步骤 2: 连接 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 点击 **Create application** → **Pages** → **Connect to Git**
4. 授权 GitHub 访问
5. 选择你的 `httping` 仓库

#### 步骤 3: 配置构建设置

在 Cloudflare Pages 设置页面填写：

| 配置项           | 值              |
| ---------------- | --------------- |
| **项目名称**     | `httping`       |
| **生产分支**     | `main`          |
| **构建命令**     | `npm run build` |
| **构建输出目录** | `dist`          |
| **Node.js 版本** | `18` 或 `20`    |

#### 步骤 4: 开始部署

点击 **Save and Deploy**，Cloudflare 会自动：

1. 拉取代码
2. 安装依赖
3. 运行构建
4. 部署到 CDN

#### 步骤 5: 后续自动部署

配置完成后，每次推送到 `main` 分支都会自动触发部署：

```bash
# 修改代码后
git add .
git commit -m "Update feature"
git push origin main
```

---

## 配置说明

### wrangler.toml

项目配置文件，位于项目根目录。

```toml
# 项目名称
name = "httping"

# 兼容性日期（Cloudflare API 版本）
compatibility_date = "2025-11-20"

# 构建输出目录
pages_build_output_dir = "./dist"
```

**配置说明：**

- `name`: Cloudflare Pages 项目名称，影响默认 URL
- `compatibility_date`: 确定使用的 Cloudflare Workers API 版本
- `pages_build_output_dir`: 指定部署的静态文件目录

### .node-version

指定 Node.js 版本，确保构建环境一致。

```
18
```

如果需要使用更新的 Node.js 版本：

```
20
```

### package.json 构建脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

**脚本说明：**

- `dev`: 本地开发服务器
- `build`: 生产构建（TypeScript 编译 + Vite 打包）
- `preview`: 本地预览构建产物

---

## 环境变量

### Cloudflare Pages 环境变量

如果需要在部署时使用环境变量：

#### 通过 Dashboard 设置

1. 进入 Cloudflare Pages 项目设置
2. 点击 **Settings** → **Environment variables**
3. 添加变量，例如：
   - `VITE_API_BASE_URL`: API 基础 URL
   - `VITE_APP_VERSION`: 应用版本

#### 在代码中使用

```typescript
// 使用 Vite 环境变量
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

#### 本地开发环境变量

创建 `.env` 文件：

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_VERSION=1.0.0
```

> ⚠️ **注意**: `.env` 文件不应提交到 Git，确保已添加到 `.gitignore`

---

## 自定义域名

### 添加自定义域名

如果你拥有域名，可以绑定到 Cloudflare Pages：

#### 步骤 1: 添加域名

1. 进入 Cloudflare Pages 项目
2. 点击 **Custom domains** → **Set up a custom domain**
3. 输入你的域名，例如 `httping.example.com`

#### 步骤 2: 配置 DNS

Cloudflare 会提供 DNS 记录，你需要添加：

**CNAME 记录:**

```
httping.example.com  →  httping-xxx.pages.dev
```

#### 步骤 3: 等待验证

DNS 传播通常需要几分钟到几小时，完成后：

- ✅ 自动获得 SSL/TLS 证书
- ✅ 自动 HTTPS 重定向
- ✅ 全球 CDN 加速

---

## 性能优化

### 构建优化

#### 1. 启用代码分割

Vite 默认启用，但可以进一步优化：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          utils: ["axios", "zustand"],
        },
      },
    },
  },
});
```

#### 2. 压缩和混淆

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console.log
      },
    },
  },
});
```

#### 3. 图片优化

使用 WebP 格式或压缩工具：

```bash
# 使用 imagemin 压缩图片
npm install -D vite-plugin-imagemin
```

### Cloudflare 优化

#### 1. 启用 Auto Minify

在 Cloudflare Dashboard:

1. 进入 **Speed** → **Optimization**
2. 启用 **Auto Minify** (JavaScript、CSS、HTML)

#### 2. 启用 Brotli 压缩

Cloudflare 自动支持 Brotli 和 Gzip 压缩。

#### 3. 缓存配置

创建 `public/_headers` 文件：

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/
  Cache-Control: public, max-age=0, must-revalidate
```

---

## 故障排查

### 问题 1: 部署后无法访问

**症状**: 访问部署 URL 显示 404 或连接失败

**解决方案**:

1. 等待 1-2 分钟让 DNS 传播
2. 清除浏览器缓存: `Ctrl+Shift+Delete` (Windows) / `Cmd+Shift+Delete` (Mac)
3. 尝试使用隐身/无痕模式访问
4. 检查 Cloudflare Pages 控制台的部署状态

### 问题 2: 构建失败

**症状**: `npm run build` 报错

**解决方案**:

```bash
# 清除缓存和依赖
rm -rf node_modules package-lock.json dist

# 重新安装
npm install

# 再次构建
npm run build
```

### 问题 3: TypeScript 编译错误

**症状**: `tsc` 报类型错误

**解决方案**:

```bash
# 检查 TypeScript 版本
npm list typescript

# 修复类型错误或暂时跳过类型检查
npm run build -- --mode production
```

### 问题 4: Wrangler 登录失败

**症状**: `wrangler login` 无响应

**解决方案**:

```bash
# 手动设置 API Token
# 1. 访问 https://dash.cloudflare.com/profile/api-tokens
# 2. 创建 Token: Edit Cloudflare Workers
# 3. 设置环境变量
export CLOUDFLARE_API_TOKEN=your-token-here

# 重试部署
wrangler pages deploy dist --project-name=httping
```

### 问题 5: 部署后功能异常

**症状**: 某些功能无法正常工作

**可能原因 & 解决方案**:

1. **CORS 错误**

   - 问题: 跨域请求被阻止
   - 解决: 确保测试的 API 支持 CORS，或使用支持 CORS 的测试 API（如 httpbin.org）

2. **路径问题**

   - 问题: 资源 404
   - 解决: 检查 `vite.config.ts` 中的 `base` 配置

3. **环境变量未设置**
   - 问题: 环境变量为 undefined
   - 解决: 在 Cloudflare Pages 设置中添加环境变量

---

## 监控和分析

### Cloudflare Analytics

查看网站访问统计：

1. 进入 Cloudflare Pages 项目
2. 点击 **Analytics** 标签
3. 查看以下指标：
   - **请求数**: 总访问量
   - **带宽**: 流量使用情况
   - **独立访客**: UV 数据
   - **地理分布**: 访客地域分布

### Web Analytics (可选)

启用 Cloudflare Web Analytics 获得更详细的数据：

1. 进入 **Web Analytics**
2. 添加站点
3. 复制跟踪代码
4. 添加到 `index.html` 的 `<head>` 标签中

```html
<!-- Cloudflare Web Analytics -->
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "your-token-here"}'
></script>
```

### 错误监控

使用浏览器控制台监控错误：

**添加全局错误处理**:

```typescript
// src/main.tsx
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  // 可以发送到错误追踪服务
});
```

---

## 成本说明

### Cloudflare Pages 免费套餐

| 项目           | 免费额度       | 超出后费用 |
| -------------- | -------------- | ---------- |
| **构建次数**   | 500 次/月      | $0.50/构建 |
| **带宽**       | 无限           | 免费       |
| **请求数**     | 无限           | 免费       |
| **自定义域名** | 无限           | 免费       |
| **SSL 证书**   | 自动提供       | 免费       |
| **CDN**        | 全球 300+ 节点 | 免费       |

### 对于 Httping 项目

**预估成本: $0/月**

理由：

- 构建频率低（每月通常 < 50 次）
- 静态网站，无服务器成本
- 带宽和请求完全免费

> ✅ **结论**: 完全免费，无需担心费用

---

## 版本更新流程

### 1. 快速更新

```bash
# 修改代码
vim src/components/SomeComponent.tsx

# 构建
npm run build

# 部署
wrangler pages deploy dist --project-name=httping --commit-dirty=true
```

### 2. 版本发布流程

```bash
# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 提交更改
git add .
git commit -m "Release v1.0.1"

# 3. 打标签
git tag v1.0.1

# 4. 推送
git push origin main --tags

# 5. 构建部署
npm run build
wrangler pages deploy dist --project-name=httping
```

### 3. 回滚到之前版本

在 Cloudflare Pages Dashboard:

1. 进入项目 → **Deployments**
2. 找到要回滚的版本
3. 点击 **Rollback to this deployment**

---

## 最佳实践

### 1. 持续集成

创建 GitHub Actions 工作流自动部署：

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name=httping
```

### 2. 预览部署

为 Pull Request 创建预览环境：

```bash
# 部署到预览环境
wrangler pages deploy dist --project-name=httping --branch=feature-branch
```

每个分支会得到独立的预览 URL。

### 3. 环境隔离

使用不同项目区分环境：

- `httping-dev`: 开发环境
- `httping-staging`: 测试环境
- `httping`: 生产环境

---

## 安全建议

### 1. API Token 保护

❌ **不要**: 将 Cloudflare API Token 提交到代码仓库

✅ **应该**: 使用环境变量或 GitHub Secrets

### 2. 内容安全策略 (CSP)

创建 `public/_headers` 添加 CSP:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### 3. HTTPS Only

Cloudflare Pages 默认强制 HTTPS，确保：

- 所有外部请求使用 HTTPS
- 不要硬编码 HTTP URLs

---

## 附录

### 有用的命令

```bash
# 查看 Wrangler 版本
wrangler --version

# 查看所有 Pages 项目
wrangler pages project list

# 查看项目部署历史
wrangler pages deployment list --project-name=httping

# 删除项目
wrangler pages project delete httping

# 本地预览构建
npm run preview
```

### 相关链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Vite 文档](https://vitejs.dev/)
- [React 文档](https://react.dev/)

### 技术支持

遇到问题？

1. 查看 [Cloudflare Community](https://community.cloudflare.com/)
2. 提交 GitHub Issue
3. 查阅本文档的故障排查部分

---

## 许可证

本项目采用 [指定许可证] 许可。

---

**文档版本**: 1.0.0  
**最后更新**: 2025-11-20  
**维护者**: [@Perlou](https://github.com/Perlou)
