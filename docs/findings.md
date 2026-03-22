# 调研发现

## 源码结构分析

### 已有的文件
```
lezao-education-platform/
├── index.html           # 登录页 - 已完成
├── register.html        # 注册页 - 已完成
├── dashboard.html       # 工作台 - 基础框架完成
├── scratch-editor.html  # Scratch编辑器 - 基础框架
├── scratch-test.html    # Scratch测试
├── js/
│   ├── api.js         # API封装（本地模拟）
│   └── auth.js        # 认证工具
├── css/               # 样式文件
├── assets/            # 静态资源
├── docs/
│   └── plans/
│       ├── 2026-03-14-login-system-design.md  # 登录设计
│       └── 2026-03-14-login-implementation.md   # 登录实现
└── README.md          # 项目说明
```

### 登录系统实现细节
- 密码加密：SHA-256（Web Crypto API）
- 会话管理：LocalStorage + Token
- 默认老师账号：teacher1 / lezhao123

### 数据存储
- 当前：LocalStorage（本地）
- 计划：飞书多维表格（云端）

## 已有功能的代码分析

### 1. 登录流程 (index.html)
- 角色选择：老师/学生
- 用户名/密码输入
- 记住我选项
- 错误提示

### 2. 注册流程 (register.html)
- 用户名查重
- 密码确认
- 班级选择
- 自动登录

### 3. 工作台 (dashboard.html)
- 顶部：logo + 用户名 + 退出
- 统计：学生数、班级数、作品数
- 任务列表
- 区分老师/学生视图

## 需要实现的功能

### 老师工作台
1. 学生管理
   - 查看学生列表
   - 添加学生
   - 编辑学生信息
   - 删除学生

2. 班级管理
   - 创建班级
   - 编辑班级
   - 删除班级
   - 分配学生到班级

3. 作业管理
   - 创建作业
   - 布置作业
   - 查看提交
   - 评分

### 学生工作台
1. 课程学习
   - 课程列表
   - 课程详情
   - 学习进度

2. 作业
   - 查看作业
   - 提交作业

3. 作品
   - 我的作品
   - 创建作品
   - 编辑作品
