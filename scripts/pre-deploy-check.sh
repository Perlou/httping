#!/bin/bash

# ==========================================
# 部署前检查脚本
# ==========================================
# 用途: 在部署前进行全面的代码质量检查
# 使用: ./scripts/pre-deploy-check.sh
# ==========================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

print_section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    ((ERRORS++))
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    ((WARNINGS++))
}

# ==========================================
# 检查项
# ==========================================

check_git_branch() {
    print_section "Git 分支检查"
    
    if [ -d .git ]; then
        CURRENT_BRANCH=$(git branch --show-current)
        echo "当前分支: $CURRENT_BRANCH"
        
        if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
            print_warning "不在主分支上，确认这是预期行为"
        else
            print_success "在主分支上"
        fi
    else
        print_warning "不是 Git 仓库"
    fi
}

check_uncommitted_changes() {
    print_section "未提交更改检查"
    
    if [ -d .git ]; then
        if [[ -n $(git status -s) ]]; then
            print_warning "有未提交的更改:"
            git status -s
        else
            print_success "没有未提交的更改"
        fi
    fi
}

check_dependencies() {
    print_section "依赖检查"
    
    if [ -f "package-lock.json" ]; then
        if [ "package-lock.json" -nt "node_modules" ]; then
            print_warning "package-lock.json 比 node_modules 新，可能需要重新安装"
        else
            print_success "依赖是最新的"
        fi
    fi
    
    # 检查是否有未使用的依赖
    if command -v npx &> /dev/null; then
        echo "检查未使用的依赖..."
        # 注意: 这需要安装 depcheck
        if npx depcheck --json > /dev/null 2>&1; then
            print_success "依赖检查通过"
        fi
    fi
}

check_typescript() {
    print_section "TypeScript 类型检查"
    
    if [ -f "tsconfig.json" ]; then
        echo "运行 TypeScript 编译检查..."
        if npx tsc --noEmit; then
            print_success "TypeScript 类型检查通过"
        else
            print_error "TypeScript 类型检查失败"
        fi
    fi
}

check_tests() {
    print_section "测试检查"
    
    if grep -q "\"test\"" package.json; then
        echo "运行测试套件..."
        if npm test -- --run > /dev/null 2>&1; then
            print_success "所有测试通过"
        else
            print_error "测试失败"
        fi
    else
        print_warning "未配置测试"
    fi
}

check_build() {
    print_section "构建检查"
    
    echo "尝试构建项目..."
    if npm run build > /tmp/build.log 2>&1; then
        print_success "构建成功"
        
        # 检查构建产物大小
        if [ -d "dist" ]; then
            BUILD_SIZE=$(du -sh dist | cut -f1)
            echo "构建产物大小: $BUILD_SIZE"
            
            # 检查 JavaScript 文件大小
            JS_FILES=$(find dist -name "*.js" -type f)
            for file in $JS_FILES; do
                SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
                SIZE_MB=$((SIZE / 1024 / 1024))
                if [ $SIZE_MB -gt 1 ]; then
                    print_warning "大型 JS 文件: $(basename $file) (${SIZE_MB}MB)"
                fi
            done
        fi
    else
        print_error "构建失败"
        echo "查看详细错误: cat /tmp/build.log"
    fi
}

check_env_files() {
    print_section "环境文件检查"
    
    if [ -f ".env" ]; then
        print_warning "发现 .env 文件，确保它不会被部署"
        
        if ! grep -q ".env" .gitignore 2>/dev/null; then
            print_error ".env 未添加到 .gitignore"
        fi
    fi
    
    if [ -f ".env.local" ] || [ -f ".env.production" ]; then
        print_warning "发现环境配置文件，确保敏感信息不会泄露"
    fi
}

check_security() {
    print_section "安全检查"
    
    # 检查是否有硬编码的密钥
    echo "扫描可能的硬编码密钥..."
    
    SUSPICIOUS_PATTERNS=(
        "API_KEY"
        "PRIVATE_KEY"
        "SECRET"
        "PASSWORD"
        "TOKEN"
    )
    
    for pattern in "${SUSPICIOUS_PATTERNS[@]}"; do
        if grep -r "$pattern.*=.*['\"]" src/ --exclude-dir=node_modules 2>/dev/null | grep -v "VITE_" > /dev/null; then
            print_warning "发现可能的硬编码密钥: $pattern"
        fi
    done
    
    # 检查 npm 漏洞
    echo "检查 npm 安全漏洞..."
    if npm audit --production > /tmp/audit.log 2>&1; then
        print_success "没有发现已知安全漏洞"
    else
        CRITICAL=$(grep "critical" /tmp/audit.log | wc -l | tr -d ' ')
        HIGH=$(grep "high" /tmp/audit.log | wc -l | tr -d ' ')
        
        if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
            print_error "发现严重安全漏洞 (Critical: $CRITICAL, High: $HIGH)"
            echo "运行 'npm audit' 查看详情"
        else
            print_warning "发现一些安全问题，运行 'npm audit' 查看详情"
        fi
    fi
}

check_file_sizes() {
    print_section "文件大小检查"
    
    # 检查是否有大型文件
    echo "检查大型文件 (>1MB)..."
    LARGE_FILES=$(find public src -type f -size +1M 2>/dev/null || true)
    
    if [ -n "$LARGE_FILES" ]; then
        print_warning "发现大型文件:"
        echo "$LARGE_FILES" | while read file; do
            SIZE=$(du -h "$file" | cut -f1)
            echo "  - $file ($SIZE)"
        done
    else
        print_success "没有发现过大的文件"
    fi
}

check_console_logs() {
    print_section "Console 日志检查"
    
    # 检查源码中是否有 console.log
    CONSOLE_LOGS=$(grep -r "console\." src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$CONSOLE_LOGS" -gt 0 ]; then
        print_warning "发现 $CONSOLE_LOGS 个 console 语句，生产环境建议移除"
    else
        print_success "没有发现 console 语句"
    fi
}

check_todos() {
    print_section "TODO 注释检查"
    
    TODOS=$(grep -r "TODO\|FIXME\|XXX" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$TODOS" -gt 0 ]; then
        print_warning "发现 $TODOS 个待办事项注释"
        echo "运行以下命令查看详情:"
        echo "  grep -rn 'TODO\\|FIXME\\|XXX' src/"
    else
        print_success "没有待办事项"
    fi
}

# ==========================================
# 主流程
# ==========================================

show_summary() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}检查摘要${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    
    if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}✓ 所有检查通过！可以安全部署。${NC}"
        exit 0
    elif [ $ERRORS -eq 0 ]; then
        echo -e "${YELLOW}⚠ 发现 $WARNINGS 个警告${NC}"
        echo -e "${YELLOW}建议修复后再部署${NC}"
        exit 0
    else
        echo -e "${RED}✗ 发现 $ERRORS 个错误和 $WARNINGS 个警告${NC}"
        echo -e "${RED}必须修复错误后才能部署${NC}"
        exit 1
    fi
}

main() {
    echo -e "${BLUE}"
    cat << "EOF"
╔═╗┬─┐┌─┐  ╔╦╗┌─┐┌─┐┬  ┌─┐┬ ┬  ╔═╗┬ ┬┌─┐┌─┐┬┌─
╠═╝├┬┘├┤────║║├┤ ├─┘│  │ │└┬┘  ║  ├─┤├┤ │  ├┴┐
╩  ┴└─└─┘  ═╩╝└─┘┴  ┴─┘└─┘ ┴   ╚═╝┴ ┴└─┘└─┘┴ ┴
EOF
    echo -e "${NC}\n"
    
    check_git_branch
    check_uncommitted_changes
    check_dependencies
    check_typescript
    check_tests
    check_build
    check_env_files
    check_security
    check_file_sizes
    check_console_logs
    check_todos
    
    show_summary
}

main "$@"
