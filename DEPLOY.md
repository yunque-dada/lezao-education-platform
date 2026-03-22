# 部署流程文档

> 创建时间：2026-03-23
> 适用平台：Railway

---

## 快速部署

### 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/yunque-dada/lezao-education-platform.git
cd lezao-education-platform

# 2. 安装依赖
npm install

# 3. 复制环境配置
cp .env.example .env

# 4. 启动服务
npm start
# 访问 http://localhost:3000
```

### 一键部署到 Railway

```bash
# 确保已安装 Railway CLI
npm i -g @railway/cli

# 登录 Railway
railway login

# 链接项目
railway link

# 部署
railway up
```

---

## 完整部署流程

### 步骤 1：准备 GitHub 仓库

```bash
# 初始化 Git（如果需要）
git init
git add .
git commit -m "feat: initial commit"

# 创建 GitHub 仓库并推送
git remote add origin https://github.com/yunque-dada/lezao-education-platform.git
git branch -M main
git push -u origin main
```

### 步骤 2：Railway 部署

1. 访问 [Railway](https://railway.app)
2. 使用 GitHub 登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择 `yunque-dada/lezao-education-platform`
5. 配置环境变量（可选）：
   - `PORT`: 3000
   - `DATABASE_URL`: PostgreSQL 连接字符串（生产环境）
6. 点击 "Deploy"

### 步骤 3：验证部署

- 访问 `https://your-project-name.up.railway.app`
- 测试登录功能
- 确认所有页面正常加载

---

## 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| PORT | 服务端口 | 3000 |
| DATABASE_URL | PostgreSQL 连接字符串 | - |
| JWT_SECRET | JWT 密钥 | lezao-secret-key |

---

## 本地构建检查

在推送代码前，运行以下检查：

```bash
# 1. 清理 node_modules（如果存在）
rm -rf node_modules
rm -f package-lock.json

# 2. 重新安装依赖
npm install

# 3. 启动测试
npm start

# 4. 验证无报错后，提交代码
git add .
git commit -m "feat: your feature"
git push
```

---

## 提交规范

```
feat:     新功能
fix:      Bug 修复
docs:     文档更新
refactor: 代码重构
style:    样式调整
perf:     性能优化
chore:    构建/工具
```

示例：
```bash
git commit -m "feat: 添加学生作品展示功能"
git commit -m "fix: 修复登录页面空白问题"
```

---

## Railway 常用命令

```bash
# 查看日志
railway logs

# 打开控制台
railway open

# 重启服务
railway restart

# 关联域名
railway domain
```

---

## 回滚操作

```bash
# 查看部署历史
railway deployments

# 回滚到指定版本
railway rollback [deployment-id]
```

---

## 访问地址

- **GitHub**: https://github.com/yunque-dada/lezao-education-platform
- **Railway**: https://lezao-pingtai.up.railway.app

---

*保持简洁，每次推送自动部署*
