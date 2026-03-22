# 文件说明文档

> 更新：2026-03-21

---

## 项目结构

```
lezao-education-platform/
├── index.html              # 统一登录页（老师/学生/管理员）
├── dashboard.html          # 老师工作台
├── admin-dashboard.html   # 管理后台（管理员）
├── student-index.html     # 学生端首页 ⭐
├── python-editor.html     # Python 在线编辑器
├── scratch-editor.html    # Scratch 编辑器
│
├── js/
│   ├── api.js           # API 接口（数据存储）
│   ├── auth.js          # 登录验证工具
│   └── feishu-api.js   # 飞书API（预留）
│
├── css/                  # 样式文件
├── assets/               # 静态资源
└── docs/
    ├── DEVELOPMENT.md   # 开发文档
    ├── SKILLS.md        # 技能学习
    ├── REORGANIZE.md    # 整理计划
    └── task_plan.md     # 任务计划
```

---

## 页面功能

### 1. index.html - 统一登录页
| 功能 | 说明 |
|------|------|
| 用户登录 | 用户名+密码 |
| 角色选择 | 老师/学生/管理员 |
| 记住密码 | 7天免登录 |
| 跳转目标 | 根据角色跳转不同页面 |

### 2. dashboard.html - 老师工作台
| 功能 | 说明 |
|------|------|
| 学生管理 | 查看/添加/删除学生 |
| 班级管理 | 创建/编辑班级 |
| 作业管理 | 发布/批改作业 |
| 作品审核 | 查看/审核学生作品 |

### 3. admin-dashboard.html - 管理后台
| 功能 | 说明 |
|------|------|
| 用户管理 | 老师/学生/管理员 |
| 系统设置 | 基础配置 |

### 4. student-index.html - 学生端 ⭐
| 功能 | 说明 |
|------|------|
| 首页 | 快速入口 |
| Scratch 编程 | 官方编辑器嵌入 |
| Python 编程 | 在线代码编辑器 |
| 我的课程 | 课程列表 |
| 我的作业 | 作业列表 |
| 我的作品 | 作品展示 |

---

## 数据存储

### LocalStorage 键名

| 键名 | 说明 |
|------|------|
| lezhao_users | 用户列表 |
| lezhao_classes | 班级列表 |
| lezhao_auth | 登录信息 |

### 用户角色

| role | 说明 |
|------|------|
| admin | 管理员 |
| teacher | 老师 |
| student | 学生 |

---

## 测试账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | lezhao123 |
| 老师 | teacher1 | lezhao123 |
| 学生 | student1 | lezhao123 |

---

## Git 提交规范

### 提交前缀

| 前缀 | 说明 |
|------|------|
| feat: | 新功能 |
| fix: | Bug 修复 |
| docs: | 文档更新 |
| refactor: | 代码重构 |
| style: | 样式调整 |
| perf: | 性能优化 |

### 示例

```
feat: 添加学生端登录功能
fix: 修复登录页面空白问题
docs: 更新开发文档
```

---

## 部署

- **GitHub**: https://github.com/yunque-dada/lezao-education-platform
- **Railway**: lezao-pingtai
- **访问地址**: https://lezao-pingtai.up.railway.app

---

*最后更新：2026-03-21*
