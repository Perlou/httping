# 更新日志

本文档记录项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.4] - 2025-11-21

### 新增功能

- **cURL 导入**：一键导入 cURL 命令到请求表单
  - 自动解析 URL、方法、Headers、Body
  - 自动识别 Bearer Token 和 Basic Auth
  - 支持复杂的 JSON 数据和查询参数
  - 无外部依赖，轻量高效（减少 40% 打包体积）

### 改进

- 优化小屏幕响应式布局，URL 输入框保持可用性
- 完善单元测试覆盖率（40 个测试全部通过）

## [1.0.0] - 2025-11-20

### 新增功能

#### 核心功能

- HTTP 请求测试，支持所有方法（GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONS）
- 请求历史管理（最多 20 条记录）
- 环境变量支持（Development/Production 环境）
- 多种认证方式（Bearer Token、Basic Auth、API Key、JWT、OAuth 2.0）
- 响应详情查看（Headers、Body、状态码）
- 请求参数配置（Query 参数、Headers、Body）
- Material Design 3 界面实现
- 深色模式支持

#### 用户界面

- 现代化的 Material Design 3 界面
- 三栏布局（历史记录、请求配置、响应详情）
- 桌面端响应式设计
- 键盘快捷键支持
  - `Ctrl/Cmd + Enter` - 发送请求
  - `Ctrl/Cmd + K` - 聚焦 URL 输入框
  - `?` - 显示快捷键帮助
- GitHub 仓库链接
- 赞助弹窗（支付宝/微信二维码）

#### 开发者功能

- TypeScript 类型安全
- React 19 + 现代 Hooks
- Zustand 状态管理
- Vitest 测试框架
- Vite 7 构建系统
- Tailwind CSS 样式

#### 部署

- Cloudflare Pages 部署配置
- 自动化部署脚本（`deploy.sh`）
- 部署前质量检查（`scripts/pre-deploy-check.sh`）
- GitHub Actions 工作流（仅手动触发）
- 生产环境 URL：https://perlou-httping.pages.dev

#### 文档

- 完整的 README 快速入门指南
- 完整的部署文档（DEPLOYMENT.md）
- README 中的应用界面截图
- MIT 开源许可证

### 变更

- 项目名称从 `httping` 改为 `perlou-httping`（原名称已被占用）
- 文档从 11 个文件精简到 2 个核心文件
- README 从 425 行优化到 103 行
- DEPLOYMENT.md 从 763 行精简到 169 行

### 修复

- CORS 跨域请求处理
- URL 中的环境变量替换功能
- 请求历史数量限制执行（最多 20 条）
- URL 验证和协议自动添加

### 移除

- 冗余的文档文件（删除 5 个文件）
- Agent 文档目录（.agentic/）
- Web 部署中未使用的 Tauri 配置

## [未发布]

### 计划功能

- 请求集合管理
- 代码生成（JavaScript/Python/cURL/Go）
- JSON 响应格式化和语法高亮
- 批量请求测试
- WebSocket 支持
- GraphQL 支持
- 请求/响应导入导出
- 响应内容搜索功能
- 性能可视化

---

## 版本历史

- **1.0.4** (2025-11-21) - cURL 导入功能
  - 一键导入 cURL 命令
  - 自动解析请求参数、Headers、Body、认证
  - 优化小屏幕响应式布局
  - 完善测试覆盖率
- **1.0.0** (2025-11-20) - 首次发布，包含核心 HTTP 测试功能
  - 完整的 HTTP 方法支持
  - 多种认证方式
  - 请求历史管理
  - 环境变量管理
  - Cloudflare Pages 部署
  - 完整的项目文档

---

## 相关链接

- [在线演示](https://perlou-httping.pages.dev)
- [GitHub 仓库](https://github.com/Perlou/httping)
- [问题反馈](https://github.com/Perlou/httping/issues)
- [部署指南](DEPLOYMENT.md)

---

**注意**：本更新日志遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/) 格式。
变更类型：新增、变更、弃用、移除、修复、安全。
