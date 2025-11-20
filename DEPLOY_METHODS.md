# 🚀 部署方式总结

## 当前配置

✅ **GitHub Actions**: 仅手动触发，不自动部署  
✅ **本地脚本**: 随时可用的一键部署  
✅ **PR 预览**: 自动为 Pull Request 生成预览

---

## 三种部署方式

### 1️⃣ 本地脚本部署（推荐 ⭐）

```bash
npm run deploy
```

**特点**:

- 最快速、最直接
- 不需要配置 GitHub Secrets
- 完全本地控制

**适用场景**:

- 日常开发迭代
- 快速修复部署
- 不想等待 CI/CD

---

### 2️⃣ GitHub Actions 手动触发

**步骤**:

1. 访问 GitHub 仓库
2. Actions → "Deploy to Cloudflare Pages"
3. Run workflow → 选择环境 → Run

**特点**:

- 需要配置 Secrets（首次）
- CI/CD 环境隔离
- 有完整构建日志

**适用场景**:

- 正式版本发布
- 团队协作部署
- 需要审计记录

**配置 Secrets**:

```
CLOUDFLARE_API_TOKEN - Cloudflare API Token
CLOUDFLARE_ACCOUNT_ID - Cloudflare Account ID
```

---

### 3️⃣ PR 预览（自动）

**触发**: 创建或更新 Pull Request 时自动运行

**功能**:

- 每个 PR 独立预览环境
- 预览 URL 自动评论到 PR
- 不影响生产环境

**适用场景**:

- 功能开发预览
- Code Review
- 测试新特性

---

## 📋 快速对比

| 方式               | 触发     | 速度    | 配置要求 | 最佳用途 |
| ------------------ | -------- | ------- | -------- | -------- |
| **本地脚本**       | 手动执行 | ⚡ 最快 | 无       | 日常部署 |
| **GitHub Actions** | 手动点击 | 🐢 较慢 | 需配置   | 正式发布 |
| **PR 预览**        | 自动 PR  | 🐢 较慢 | 需配置   | 功能预览 |

---

## 🎯 推荐工作流

```bash
# 开发阶段 - 使用本地部署
npm run deploy:check  # 检查代码质量
npm run deploy        # 快速部署测试

# 发布阶段 - 使用 GitHub Actions
# 1. 推送代码
git push origin main

# 2. 前往 GitHub 手动触发部署
#    Actions → Run workflow → Production
```

---

## 📚 详细文档

- **[GITHUB_ACTIONS_GUIDE.md](GITHUB_ACTIONS_GUIDE.md)** - GitHub Actions 详细指南
- **[QUICK_START_DEPLOY.md](QUICK_START_DEPLOY.md)** - 快速开始部署
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - 完整部署文档

---

**✨ 建议**: 日常开发使用 `npm run deploy`，正式发布使用 GitHub Actions 手动触发
