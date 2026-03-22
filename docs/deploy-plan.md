# 部署问题修复计划

> 创建时间：2026-03-21 19:08
> 技能：planning-with-files

---

## 问题分析

### 当前状态
- Railway 部署失败（502 Bad Gateway）
- 后端服务无法启动
- 静态网页模式正常

### 根本原因
1. better-sqlite3 需要原生编译模块
2. Railway NIXPACKS 构建环境问题
3. 端口配置不正确

---

## 解决方案

### 选项A：使用纯静态网页（当前）
- ✅ 简单稳定
- ❌ 无法实现后端功能

### 选项B：使用云数据库
- Railway + Neon (PostgreSQL)
- ✅ 可靠
- ⚠️ 需要改代码

### 选项C：使用第三方 BaaS
- Firebase / Supabase
- ✅ 免维护
- ⚠️ 需要改代码

---

## 决策

Railway 部署失败，选择**选项A：保持静态网页模式**。

---

## 执行步骤

### 1. 回退到静态模式
- [x] 已推送 railway.json（无 startCommand）

### 2. 清理后端代码（保留备用）
- [ ] 暂时移除 server.js（不删除，保存在本地）
- [ ] 推送静态版本

### 3. 后续方案
- 选项1：本地运行后端测试
- 选项2：使用 Railway + Neon 数据库
- 选项3：使用 GitHub Codespaces

---

## 状态
- [x] 规划完成
- [ ] 执行静态模式回退
