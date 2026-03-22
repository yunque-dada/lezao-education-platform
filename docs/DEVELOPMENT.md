# 乐造AI教育平台 - 开发文档

> 最后更新：2026-03-21
> 版本：v1.0

---

## 一、项目概览

| 项目 | 内容 |
|------|------|
| **GitHub 仓库** | https://github.com/yunque-dada/lezao-education-platform |
| **Railway 项目** | lezao-pingtai |
| **访问地址** | https://lezao-pingtai.up.railway.app |
| **技术栈** | HTML + CSS + JavaScript (纯前端) |
| **目标用户** | 6-15岁学生 + 老师 |

### 核心功能
- Scratch 3.0 编程 - 官方编辑器嵌入
- Python 编程 - 在线代码编辑器
- 课程学习 - 观看课程，做作业
- 作品管理 - 保存、提交、批改

---

## 二、文件结构

```
lezao-education-platform/
├── index.html              # 统一登录页 ⭐
├── dashboard.html         # 老师工作台
├── admin-dashboard.html   # 管理后台
├── student-index.html    # 学生端 ⭐
├── python-editor.html    # Python编辑器
├── scratch-editor.html   # Scratch编辑器
├── railway.json          # Railway配置
├── README.md             # 项目说明
│
├── js/
│   ├── api.js           # API接口（数据存储）
│   ├── auth.js          # 登录验证
│   └── feishu-api.js   # 飞书API（预留）
│
├── css/                  # 样式文件
├── assets/               # 静态资源
└── docs/                # 文档
```

---

## 三、页面功能

### index.html - 统一登录页
| 功能 | 说明 |
|------|------|
| 用户登录 | 用户名+密码 |
| 角色选择 | 老师/学生/管理员 |
| 记住密码 | 7天免登录 |
| 跳转目标 | 根据角色跳转不同页面 |

### dashboard.html - 老师工作台
| 功能 | 说明 |
|------|------|
| 学生管理 | 查看/添加/删除学生 |
| 班级管理 | 创建/编辑班级 |
| 作业管理 | 发布/批改作业 |
| 作品审核 | 查看/审核学生作品 |

### admin-dashboard.html - 管理后台
| 功能 | 说明 |
|------|------|
| 用户管理 | 老师/学生/管理员 |
| 系统设置 | 基础配置 |

### student-index.html - 学生端 ⭐
| 功能 | 说明 |
|------|------|
| 首页 | 快速入口 |
| Scratch 编程 | 官方编辑器嵌入 |
| Python 编程 | 在线代码编辑器 |
| 我的课程 | 课程列表 |
| 我的作业 | 作业列表 |
| 我的作品 | 作品展示 |

---

## 四、数据存储

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

## 五、测试账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | lezhao123 |
| 老师 | teacher1 | lezhao123 |
| 学生 | student1 | lezhao123 |

---

## 六、开发规划

### Phase 1: 完善功能
- [ ] 老师端 - 学生管理 CRUD
- [ ] 老师端 - 班级管理 CRUD
- [ ] 学生端 - 课程展示
- [ ] 学生端 - 作业提交

### Phase 2: 数据对接
- [ ] 连接后端 API
- [ ] 用户登录/注册 API
- [ ] 作品保存/加载 API

### Phase 3: 进阶功能
- [ ] 飞书多维表格对接
- [ ] 作品分享
- [ ] 作业批改
- [ ] 成绩统计

---

## 七、Git 提交规范

### 提交前缀
| 前缀 | 说明 |
|------|------|
| feat: | 新功能 |
| fix: | Bug 修复 |
| docs: | 文档更新 |
| refactor: | 代码重构 |
| style: | 样式调整 |

### 示例
```
feat: 添加学生端登录功能
fix: 修复登录页面空白问题
docs: 更新开发文档
```

---

## 八、部署

- **GitHub**: https://github.com/yunque-dada/lezao-education-platform
- **Railway**: lezao-pingtai
- **访问地址**: https://lezao-pingtai.up.railway.app

---

*文档版本：v1.0*
*更新日期：2026-03-21*
