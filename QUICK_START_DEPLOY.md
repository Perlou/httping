# 🚀 自动化部署系统

你的 httping 项目现在拥有完整的自动化部署系统！

## ✅ 已创建的文件

### 1. 核心部署脚本

- **`deploy.sh`** - 主部署脚本（一键部署）
- **`scripts/pre-deploy-check.sh`** - 部署前质量检查

### 2. GitHub Actions 工作流

- **`.github/workflows/deploy.yml`** - CI/CD 自动部署

### 3. 配置文件

- **`wrangler.toml`** - Cloudflare Pages 配置
- **`.node-version`** - Node.js 版本声明

### 4. 文档

- **`DEPLOYMENT.md`** - 详细部署文档
- **`scripts/README.md`** - 脚本使用说明
- **`README.md`** - 项目主文档（已更新）

### 5. package.json 脚本（已添加）

```json
{
  "deploy": "./deploy.sh",
  "deploy:check": "./scripts/pre-deploy-check.sh",
  "deploy:force": "./deploy.sh --force",
  "deploy:dry-run": "./deploy.sh --dry-run"
}
```

---

## 🎯 三种部署方式

### 方式一：本地一键部署 ⚡（最快）

```bash
npm run deploy
```

**特点**:

- ✅ 全自动环境检查
- ✅ 自动运行测试
- ✅ 交互式确认
- ✅ 彩色进度提示

**可选命令**:

```bash
npm run deploy:check      # 仅检查，不部署
npm run deploy:dry-run    # 仅构建，不部署
npm run deploy:force      # 强制部署（跳过确认）
```

---

### 方式二：GitHub Actions 🤖（最省心）

**设置步骤**:

1. **获取 Cloudflare API Token**

   - 访问: https://dash.cloudflare.com/profile/api-tokens
   - 点击 "Create Token"
   - 选择 "Edit Cloudflare Workers" 模板
   - 复制生成的 Token

2. **获取 Account ID**

   - 访问: https://dash.cloudflare.com
   - 右侧栏可以看到 "Account ID"
   - 复制此 ID

3. **配置 GitHub Secrets**

   - 进入 GitHub 仓库
   - Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - 添加两个 secrets:

     ```
     名称: CLOUDFLARE_API_TOKEN
     值: <你的 API Token>

     名称: CLOUDFLARE_ACCOUNT_ID
     值: <你的 Account ID>
     ```

4. **触发部署**
   ```bash
   git add .
   git commit -m "Add feature"
   git push origin main
   ```

**自动功能**:

- ✅ 代码质量检查
- ✅ 安全审计
- ✅ 自动构建部署
- ✅ PR 预览部署

---

### 方式三：手动部署 🔧（最灵活）

```bash
# 1. 构建
npm run build

# 2. 部署
wrangler pages deploy dist --project-name=httping
```

---

## 📋 快速上手检查清单

- [ ] 运行部署前检查: `npm run deploy:check`
- [ ] 确认所有测试通过
- [ ] 首次部署: `npm run deploy`
- [ ] 验证部署 URL 可访问
- [ ] （可选）配置 GitHub Actions Secrets
- [ ] （可选）推送到 GitHub 测试自动部署

---

## 🎨 部署脚本特性

### deploy.sh 功能

- ✅ Node.js 版本检查
- ✅ npm 和 Wrangler 安装检查
- ✅ Git 状态验证
- ✅ 自动运行测试
- ✅ 构建产物验证
- ✅ 一键部署到 Cloudflare
- ✅ 部署信息汇总

### pre-deploy-check.sh 检查项

- ✅ Git 分支检查
- ✅ 未提交更改提醒
- ✅ TypeScript 类型检查
- ✅ 单元测试执行
- ✅ 构建验证
- ✅ 环境文件安全检查
- ✅ npm 安全漏洞扫描
- ✅ 大文件检测
- ✅ Console 语句扫描
- ✅ TODO 注释统计

---

## 🔍 使用示例

### 场景 1: 首次部署

```bash
# 1. 检查环境
npm run deploy:check

# 2. 如果通过，开始部署
npm run deploy

# 按照提示操作
✓ 检查 Node.js 版本...
✓ 检查 Wrangler CLI...
✓ 运行测试...
✓ 构建项目...
? 确认部署到 Cloudflare Pages? (y/n) y
✓ 部署成功！

# 访问提供的 URL
```

### 场景 2: 日常更新

```bash
# 修改代码
vim src/components/NewFeature.tsx

# 快速部署（跳过确认）
npm run deploy:force
```

### 场景 3: 测试构建

```bash
# 只构建不部署
npm run deploy:dry-run

# 检查 dist/ 目录
ls -lh dist/
```

### 场景 4: CI/CD 流程

```bash
# 提交代码
git add .
git commit -m "Add new feature"
git push origin main

# GitHub Actions 自动：
# 1. 运行质量检查
# 2. 运行安全检查
# 3. 构建并部署
# 4. 在 Actions 标签查看进度
```

---

## ⚙️ 自定义配置

### 修改项目名称

编辑 `wrangler.toml`:

```toml
name = "my-custom-name"  # 修改这里
```

### 修改 Node.js 版本

编辑 `.node-version`:

```
20  # 改为 20
```

### 添加环境变量

创建 `.env.production`:

```env
VITE_API_URL=https://api.example.com
```

---

## 🆘 常见问题

### Q: 部署失败怎么办？

A:

1. 检查 Wrangler 是否已登录: `wrangler whoami`
2. 重新登录: `wrangler login`
3. 查看详细错误日志

### Q: GitHub Actions 失败？

A:

1. 确认已设置 Secrets
2. 检查 Token 权限
3. 查看 Actions 日志详情

### Q: 如何回滚部署？

A:

1. 访问 Cloudflare Dashboard
2. 进入 Pages 项目
3. Deployments → 选择旧版本 → Rollback

---

## 📊 部署统计示例

部署成功后会看到：

```
🎉 部署完成！

项目名称: httping
部署时间: 2025-11-20 20:30:00

🔗 访问地址:
  https://httping.pages.dev

💡 提示:
  - 首次访问可能需要等待 1-2 分钟
  - 查看部署详情: https://dash.cloudflare.com
```

---

## 🎓 进阶技巧

### 1. 设置部署钩子

在 `deploy.sh` 中添加自定义逻辑:

```bash
# 部署前钩子
before_deploy() {
    echo "Running custom pre-deploy tasks..."
    # 添加你的逻辑
}
```

### 2. 多环境部署

```bash
# 部署到测试环境
wrangler pages deploy dist --project-name=httping-staging

# 部署到生产环境
wrangler pages deploy dist --project-name=httping
```

### 3. 自动化版本号

```bash
# 更新版本并部署
npm version patch && npm run deploy
```

---

## 📚 参考文档

- [主部署文档](../DEPLOYMENT.md) - 完整部署指南
- [脚本说明](README.md) - 脚本详细说明
- [Cloudflare Pages](https://developers.cloudflare.com/pages/) - 官方文档

---

**🎊 现在你可以轻松部署了！选择一种方式开始吧！**

建议: 先运行 `npm run deploy:check`，然后 `npm run deploy` 完成首次部署。
