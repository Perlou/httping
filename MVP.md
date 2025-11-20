# Httping MVP 开发计划

## 核心价值主张

**一句话**：Httping 帮助开发者快速测试 API，无需复杂配置，专注于核心功能。

## 目标用户

- **主要用户**：前端/后端开发者
- **次要用户**：QA 工程师，API 设计师
- **典型场景**：
  - 快速测试新开发的 API 接口
  - 调试线上 API 问题
  - 验证 API 响应格式
  - 管理常用 API 请求

## MVP 功能列表（5 个核心功能）

### 功能 1：HTTP 请求发送

- **用户故事**：作为开发者，我想要发送 HTTP 请求（GET/POST/PUT/DELETE），这样我就能快速测试 API
- **验收标准**：
  - [ ] 支持 4 种基本 HTTP 方法
  - [ ] 可以输入 URL
  - [ ] 可以添加请求头（Headers）
  - [ ] 可以添加请求体（Body）- JSON/Form/Raw
  - [ ] 显示响应状态码、响应时间、响应体

### 功能 2：请求历史记录

- **用户故事**：作为开发者，我想要自动保存我的请求历史，这样我就能快速重复之前的测试
- **验收标准**：
  - [ ] 自动保存每个请求
  - [ ] 显示历史列表（最近 50 条）
  - [ ] 点击历史记录可以恢复
  - [ ] 可以删除单条历史
  - [ ] 可以清空所有历史

### 功能 3：环境变量管理

- **用户故事**：作为开发者，我想要切换不同环境（dev/staging/prod），这样我就能在不同环境测试同一个 API
- **验收标准**：
  - [ ] 创建环境（名称 + 变量键值对）
  - [ ] 切换环境
  - [ ] 在 URL/Headers 中使用变量（{{baseUrl}}）
  - [ ] 至少支持 3 个环境

### 功能 4：认证支持

- **用户故事**：作为开发者，我想要方便地添加认证信息，这样我就能测试需要鉴权的 API
- **验收标准**：
  - [ ] Bearer Token 认证
  - [ ] Basic Auth 认证
  - [ ] 自动在 Headers 中添加 Authorization

### 功能 5：响应格式化

- **用户故事**：作为开发者，我想要查看格式化的响应，这样我就能快速理解 API 返回的数据
- **验收标准**：
  - [ ] JSON 格式化和语法高亮
  - [ ] 响应大小显示
  - [ ] 响应时间显示
  - [ ] 复制响应内容
  - [ ] Raw/Pretty 视图切换

## 不做的功能（V1 不做，V2 再考虑）

- ❌ Collections（请求集合）- 历史记录已够用
- ❌ 团队协作 - 先做好单机版
- ❌ GraphQL - 先专注 REST API
- ❌ 代码生成 - 非核心功能
- ❌ Mock Server - 太复杂
- ❌ 测试脚本 - 超出 MVP 范围

## 技术栈

### 前端

- **框架**：React 18 + TypeScript
- **UI 库**：shadcn/ui（基于 Radix UI + Tailwind CSS）
- **状态管理**：Zustand（轻量级）
- **代码编辑器**：Monaco Editor 或 CodeMirror
- **HTTP 客户端**：Axios

### 桌面应用

- **框架**：Tauri（Rust 后端 + Web 前端）
- **理由**：
  - 比 Electron 更轻量（体积小 10 倍）
  - 性能更好
  - 更安全
  - Rust 生态强大

### 数据存储

- **本地数据库**：SQLite
- **ORM**：Diesel（Rust）
- **存储内容**：
  - 请求历史
  - 环境配置
  - 用户设置

## 技术架构

```
┌─────────────────────────────────────────┐
│           Tauri Desktop App             │
├─────────────────────────────────────────┤
│  Frontend (React + TypeScript)          │
│  ├─ Components                          │
│  ├─ Store (Zustand)                     │
│  └─ HTTP Client (Axios)                 │
├─────────────────────────────────────────┤
│  Backend (Rust + Tauri)                 │
│  ├─ Commands (API)                      │
│  ├─ Database (SQLite + Diesel)          │
│  └─ File System                         │
└─────────────────────────────────────────┘
```

## 项目结构

```
httping/
├── src/                    # React 前端代码
│   ├── components/         # UI 组件
│   ├── store/             # Zustand 状态管理
│   ├── types/             # TypeScript 类型
│   ├── utils/             # 工具函数
│   ├── App.tsx            # 主应用
│   └── main.tsx           # 入口文件
├── src-tauri/             # Rust 后端代码
│   ├── src/
│   │   ├── main.rs        # Tauri 主文件
│   │   ├── commands.rs    # Tauri 命令
│   │   └── db/            # 数据库相关
│   ├── Cargo.toml         # Rust 依赖
│   └── tauri.conf.json    # Tauri 配置
├── public/                # 静态资源
├── docs/                  # 文档
├── .github/               # GitHub Actions
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── README.md
├── LICENSE
└── .gitignore
```

## 开发计划

### Week 1：项目搭建 + 核心功能

**Day 1-2**：项目初始化

- [x] 创建 Git 仓库
- [ ] 初始化 Tauri 项目
- [ ] 配置 Vite + React + TypeScript
- [ ] 配置 Tailwind CSS + shadcn/ui
- [ ] 创建基础 UI 布局

**Day 3-4**：HTTP 请求功能

- [ ] 实现请求输入表单（URL + Method + Headers + Body）
- [ ] 集成 Axios 发送请求
- [ ] 实现响应显示（状态码 + 时间 + Body）
- [ ] JSON 格式化和高亮

**Day 5-7**：请求历史

- [ ] 设计 SQLite 数据库 schema
- [ ] 实现 Rust 端数据库操作
- [ ] 实现历史列表 UI
- [ ] 实现点击历史恢复请求

### Week 2：环境变量 + 认证

**Day 8-10**：环境变量

- [ ] 环境管理 UI（创建/编辑/删除/切换）
- [ ] 变量替换功能（{{var}}）
- [ ] 保存到数据库

**Day 11-12**：认证

- [ ] Bearer Token UI
- [ ] Basic Auth UI
- [ ] 自动添加 Authorization header

**Day 13-14**：优化和测试

- [ ] Bug 修复
- [ ] UI 优化
- [ ] 性能测试
- [ ] 准备发布

## 成功指标

### 第 1 周目标

- [ ] 可以发送 HTTP 请求并查看响应
- [ ] 请求历史自动保存
- [ ] UI 基本可用

### 第 2 周目标

- [ ] 环境变量功能完成
- [ ] 认证功能完成
- [ ] MVP 功能全部完成

### MVP 上线后（第 3-4 周）

- [ ] 在 GitHub 发布 v0.1.0
- [ ] 在 V2EX/掘金发布
- [ ] 获得前 10 个 Star
- [ ] 收到第一个用户反馈

### 第 1 个月

- [ ] 100 个 GitHub Stars
- [ ] 10 个活跃用户
- [ ] 5 个 Issue/讨论

## UI Mockup（简单描述）

```
┌────────────────────────────────────────────────────────────┐
│  Httping                                    [_] [□] [X]     │
├────────────────────────────────────────────────────────────┤
│  Request                                                    │
│  ┌──────────┬───────────────────────────────────────────┐ │
│  │ GET ▼   │ https://api.example.com/users         [Send]│ │
│  └──────────┴───────────────────────────────────────────┘ │
│                                                            │
│  [Headers] [Body] [Auth] [Env: Production ▼]              │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Body                                                │  │
│  │ {                                                   │  │
│  │   "name": "John Doe"                               │  │
│  │ }                                                   │  │
│  └────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────┤
│  Response                        Status: 200 Time: 234ms   │
│  ┌────────────────────────────────────────────────────┐  │
│  │ [Pretty] [Raw] [Headers]                           │  │
│  │                                                     │  │
│  │ {                                                   │  │
│  │   "id": 1,                                         │  │
│  │   "name": "John Doe",                              │  │
│  │   "email": "john@example.com"                      │  │
│  │ }                                                   │  │
│  └────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────┤
│  History (sidebar)                                         │
│  • GET /users (200) - 2 min ago                           │
│  • POST /auth/login (201) - 5 min ago                     │
│  • GET /products (404) - 10 min ago                       │
└────────────────────────────────────────────────────────────┘
```

## 下一步

1. **今天**：

   - [ ] 初始化 Tauri 项目
   - [ ] 配置开发环境

2. **本周**：

   - [ ] 完成基础 UI
   - [ ] 实现 HTTP 请求功能

3. **下周**：
   - [ ] 完成所有 MVP 功能
   - [ ] 准备发布

---

**Start Date**: 2025-11-20  
**Target MVP Release**: 2025-12-04 (2 weeks)
