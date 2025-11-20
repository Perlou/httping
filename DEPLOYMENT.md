# 部署指南

Httping 部署到 Cloudflare Pages 的完整指南。

---

## 快速部署

### 方式一：一键部署（推荐）

```bash
npm run deploy
```

脚本会自动：

- 检查环境（Node.js、Wrangler）
- 运行测试
- 构建项目
- 部署到 Cloudflare Pages

**可用选项**:

```bash
npm run deploy:check      # 部署前检查
npm run deploy:dry-run    # 仅构建
npm run deploy:force      # 强制部署
```

### 方式二：手动部署

```bash
# 1. 构建
npm run build

# 2. 部署
wrangler pages deploy dist --project-name=perlou-httping
```

---

## 配置文件

### wrangler.toml

```toml
name = "perlou-httping"
compatibility_date = "2025-11-20"
pages_build_output_dir = "./dist"
```

### .node-version

```
18
```

---

## GitHub Actions 部署

### 设置 Secrets

在 GitHub 仓库设置中添加：

- `CLOUDFLARE_API_TOKEN` - [创建 Token](https://dash.cloudflare.com/profile/api-tokens)
- `CLOUDFLARE_ACCOUNT_ID` - 在 Dashboard 右侧

### 手动触发

1. 访问 GitHub → Actions
2. 选择 "Deploy to Cloudflare Pages"
3. 点击 "Run workflow"

> 注意：不会自动部署，仅手动触发

---

## 自定义域名

### 添加域名

1. 访问 [Cloudflare Pages](https://dash.cloudflare.com)
2. 进入项目 → Custom domains
3. 添加域名并配置 DNS

**DNS 配置**:

```
CNAME: your-domain.com → perlou-httping.pages.dev
```

---

## 环境变量

在 Cloudflare Pages 项目设置中添加：

```
Settings → Environment variables
```

在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 故障排查

### 部署失败

**检查**:

1. Wrangler 已登录：`wrangler whoami`
2. 重新登录：`wrangler login`
3. 查看错误日志

### 构建失败

```bash
rm -rf node_modules dist
npm install
npm run build
```

### GitHub Actions 失败

1. 检查 Secrets 是否正确
2. 确认 Token 权限
3. 查看 Actions 日志

---

## 成本

**完全免费**

Cloudflare Pages 免费套餐：

- 无限带宽
- 每月 500 次构建
- 免费 SSL 证书
- 全球 CDN

---

## 有用的命令

```bash
# Wrangler
wrangler pages project list              # 列出项目
wrangler pages deployment list           # 查看部署历史
wrangler pages project delete <name>     # 删除项目

# 本地
npm run dev                              # 开发
npm run build                            # 构建
npm run preview                          # 预览构建
npm test                                 # 测试
```

---

**部署 URL**: https://perlou-httping.pages.dev

查看 [README](README.md) 了解项目信息
