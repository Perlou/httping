#!/bin/bash

# ==========================================
# Httping 自动化部署脚本
# ==========================================
# 用途: 自动构建并部署到 Cloudflare Pages
# 使用: ./deploy.sh [options]
# ==========================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="perlou-httping"
BUILD_DIR="dist"
NODE_MIN_VERSION=18

# ==========================================
# 辅助函数
# ==========================================

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# ==========================================
# 环境检查
# ==========================================

check_node_version() {
    print_info "检查 Node.js 版本..."
    
    if ! command -v node &> /dev/null; then
        print_error "未找到 Node.js，请先安装 Node.js"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    
    if [ "$NODE_VERSION" -lt "$NODE_MIN_VERSION" ]; then
        print_warning "Node.js 版本过低 (当前: v$NODE_VERSION, 推荐: v$NODE_MIN_VERSION+)"
        read -p "是否继续? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_success "Node.js 版本: v$NODE_VERSION"
    fi
}

check_npm() {
    print_info "检查 npm..."
    
    if ! command -v npm &> /dev/null; then
        print_error "未找到 npm"
        exit 1
    fi
    
    print_success "npm 版本: $(npm -v)"
}

check_wrangler() {
    print_info "检查 Wrangler CLI..."
    
    if ! command -v wrangler &> /dev/null; then
        print_warning "未找到 Wrangler CLI"
        read -p "是否安装 Wrangler? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install -g wrangler
            print_success "Wrangler 安装完成"
        else
            print_error "部署需要 Wrangler CLI"
            exit 1
        fi
    else
        print_success "Wrangler 版本: $(wrangler --version)"
    fi
}

check_git_status() {
    print_info "检查 Git 状态..."
    
    if [ -d .git ]; then
        if [[ -n $(git status -s) ]]; then
            print_warning "有未提交的更改"
            git status -s
            echo
            read -p "是否继续部署? (y/n) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
            COMMIT_DIRTY="--commit-dirty=true"
        else
            print_success "工作区干净"
            COMMIT_DIRTY=""
        fi
    else
        print_warning "当前目录不是 Git 仓库"
        COMMIT_DIRTY="--commit-dirty=true"
    fi
}

# ==========================================
# 构建流程
# ==========================================

install_dependencies() {
    print_header "安装依赖"
    
    if [ ! -d "node_modules" ]; then
        print_info "首次安装依赖..."
        npm install
    else
        print_info "依赖已存在，跳过安装"
        print_info "如需重新安装，请运行: rm -rf node_modules && npm install"
    fi
    
    print_success "依赖准备完成"
}

run_tests() {
    print_header "运行测试"
    
    if grep -q "\"test\"" package.json; then
        print_info "运行单元测试..."
        if npm test -- --run; then
            print_success "测试通过"
        else
            print_error "测试失败"
            read -p "是否继续部署? (y/n) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
    else
        print_warning "未找到测试脚本，跳过测试"
    fi
}

build_project() {
    print_header "构建项目"
    
    # 清理旧的构建产物
    if [ -d "$BUILD_DIR" ]; then
        print_info "清理旧的构建产物..."
        rm -rf "$BUILD_DIR"
    fi
    
    print_info "开始构建..."
    if npm run build; then
        print_success "构建完成"
    else
        print_error "构建失败"
        exit 1
    fi
    
    # 验证构建产物
    if [ ! -d "$BUILD_DIR" ]; then
        print_error "构建目录 $BUILD_DIR 不存在"
        exit 1
    fi
    
    if [ ! -f "$BUILD_DIR/index.html" ]; then
        print_error "构建产物中缺少 index.html"
        exit 1
    fi
    
    # 显示构建统计
    print_info "构建产物统计:"
    echo "  文件数: $(find $BUILD_DIR -type f | wc -l | tr -d ' ')"
    echo "  总大小: $(du -sh $BUILD_DIR | cut -f1)"
}

# ==========================================
# 部署流程
# ==========================================

deploy_to_cloudflare() {
    print_header "部署到 Cloudflare Pages"
    
    print_info "开始部署..."
    
    DEPLOY_CMD="wrangler pages deploy $BUILD_DIR --project-name=$PROJECT_NAME $COMMIT_DIRTY"
    
    print_info "执行命令: $DEPLOY_CMD"
    echo
    
    if eval $DEPLOY_CMD; then
        print_success "部署成功！"
        return 0
    else
        print_error "部署失败"
        return 1
    fi
}

# ==========================================
# 部署后操作
# ==========================================

show_deployment_info() {
    print_header "部署信息"
    
    echo -e "${GREEN}🎉 部署完成！${NC}\n"
    echo "项目名称: $PROJECT_NAME"
    echo "部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo
    echo -e "${BLUE}访问地址:${NC}"
    echo "  https://$PROJECT_NAME.pages.dev"
    echo
    echo -e "${YELLOW}提示:${NC}"
    echo "  - 首次访问可能需要等待 1-2 分钟"
    echo "  - 查看部署详情: https://dash.cloudflare.com"
    echo
}

# ==========================================
# 主流程
# ==========================================

show_usage() {
    cat << EOF
Httping 自动化部署脚本

用法: 
  ./deploy.sh [options]

选项:
  -h, --help          显示帮助信息
  -s, --skip-tests    跳过测试
  -f, --force         强制部署（跳过所有确认）
  -d, --dry-run       仅构建，不部署
  -c, --clean         清理并重新安装依赖

示例:
  ./deploy.sh                 # 完整部署流程
  ./deploy.sh --skip-tests    # 跳过测试
  ./deploy.sh --dry-run       # 仅构建不部署
  ./deploy.sh --clean         # 清理重建

EOF
}

main() {
    # 解析参数
    SKIP_TESTS=false
    FORCE_DEPLOY=false
    DRY_RUN=false
    CLEAN_INSTALL=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -s|--skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            -f|--force)
                FORCE_DEPLOY=true
                shift
                ;;
            -d|--dry-run)
                DRY_RUN=true
                shift
                ;;
            -c|--clean)
                CLEAN_INSTALL=true
                shift
                ;;
            *)
                print_error "未知选项: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # 显示欢迎信息
    clear
    echo -e "${BLUE}"
    cat << "EOF"
╦ ╦┌┬┐┌┬┐┌─┐┬┌┐┌┌─┐  ╔╦╗┌─┐┌─┐┬  ┌─┐┬ ┬
╠═╣ │  │ ├─┘│││││ ┬   ║║├┤ ├─┘│  │ │└┬┘
╩ ╩ ┴  ┴ ┴  ┴┘└┘└─┘  ═╩╝└─┘┴  ┴─┘└─┘ ┴ 
EOF
    echo -e "${NC}"
    echo -e "${BLUE}自动化部署到 Cloudflare Pages${NC}\n"
    
    # 清理安装（如果需要）
    if [ "$CLEAN_INSTALL" = true ]; then
        print_header "清理并重新安装"
        rm -rf node_modules package-lock.json dist
        print_success "清理完成"
    fi
    
    # 环境检查
    print_header "环境检查"
    check_node_version
    check_npm
    check_wrangler
    check_git_status
    
    # 安装依赖
    install_dependencies
    
    # 运行测试（可选）
    if [ "$SKIP_TESTS" = false ]; then
        run_tests
    else
        print_warning "跳过测试"
    fi
    
    # 构建项目
    build_project
    
    # 部署（可选）
    if [ "$DRY_RUN" = true ]; then
        print_warning "Dry run 模式，跳过部署"
        print_info "构建产物位于: $BUILD_DIR/"
        exit 0
    fi
    
    # 最后确认（除非强制模式）
    if [ "$FORCE_DEPLOY" = false ]; then
        echo
        read -p "确认部署到 Cloudflare Pages? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_warning "部署已取消"
            exit 0
        fi
    fi
    
    # 执行部署
    if deploy_to_cloudflare; then
        show_deployment_info
    else
        print_error "部署过程中出现错误"
        exit 1
    fi
}

# 运行主函数
main "$@"
