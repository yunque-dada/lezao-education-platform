# 乐造AI教务平台 - 详细开发规范

> 版本：v3.0
> 日期：2026-03-20

---

## 一、现有代码分析

### 1.1 已完成的模块

| 模块 | 文件 | 完成度 |
|------|------|--------|
| 登录页 | index.html | 90% |
| 注册页 | register.html | 90% |
| 工作台 | dashboard.html | 40% |
| 认证 | js/auth.js | 100% |
| API封装 | js/api.js | 80% |

### 1.2 数据结构（当前LocalStorage）

```javascript
// 用户数据
{
  userId: "teacher-001",
  username: "teacher1",
  password: "sha256 hash", // 加密
  role: "teacher",
  name: "乐造老师",
  classId: "",
  createdAt: 1234567890,
  lastLogin: null
}

// 班级数据
{
  classId: "class-scratch-basic",
  className: "Scratch基础班",
  teacherId: "teacher-001"
}
```

---

## 二、需要开发的功能

### 2.1 老师工作台（优先级 P0）

#### 2.1.1 学生管理
```javascript
// 功能清单
- 获取学生列表 (GET)
- 添加学生 (POST)
- 编辑学生 (PUT)
- 删除学生 (DELETE)
- 搜索学生
- 筛选学生（按班级）
```

#### 2.1.2 班级管理
```javascript
// 功能清单
- 获取班级列表 (GET)
- 创建班级 (POST)
- 编辑班级 (PUT)
- 删除班级 (DELETE)
- 分配学生到班级
```

#### 2.1.3 作业管理
```javascript
// 功能清单
- 获取作业列表 (GET)
- 创建作业 (POST)
- 布置作业到班级 (POST)
- 查看提交列表 (GET)
- 评分/点评 (PUT)
```

### 2.2 学生工作台（优先级 P0）

#### 2.2.1 课程展示
```javascript
// 课程数据结构
{
  id: "scratch-basic-01",
  name: "Scratch基础第一课",
  type: "scratch",
  level: "basic",
  description: "认识Scratch界面",
  duration: 45,
  coverImage: "url",
  tasks: [...]
}
```

#### 2.2.2 作业展示
```javascript
// 作业数据结构
{
  id: "homework-001",
  title: "第一课作业",
  description: "完成第一个作品",
  courseId: "scratch-basic-01",
  classId: "class-001",
  deadline: timestamp,
  submissions: [...]
}
```

#### 2.2.3 作品展示
```javascript
// 作品数据结构
{
  id: "project-001",
  name: "我的第一个作品",
  type: "scratch",
  content: "JSON字符串",
  cover: "base64",
  authorId: "student-001",
  createdAt: timestamp
}
```

### 2.3 Scratch编辑器（优先级 P1）

#### 2.3.1 功能清单
- [ ] 集成 scratch-gui
- [ ] 新建作品
- [ ] 保存作品
- [ ] 加载作品
- [ ] 分享作品
- [ ] 作品列表

### 2.4 Python编辑器（优先级 P1）

#### 2.4.1 功能清单
- [ ] 集成 Pyodide
- [ ] 代码编辑区
- [ ] 运行代码
- [ ] 输出结果
- [ ] 保存作品

---

## 三、页面设计

### 3.1 老师工作台页面结构

```
┌─────────────────────────────────────────────┐
│  [Logo] 乐造AI    老师: 张老师  [退出]    │
├─────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ 学生管理 │ │ 班级管理 │ │ 作业管理 │    │
│  └─────────┘ └─────────┘ └─────────┘    │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ 学生列表                              │  │
│  │ ┌─────┬──────┬──────┬──────┐       │  │
│  │ │ 姓名 │ 用户名│ 班级 │ 操作 │       │  │
│  │ ├─────┼──────┼──────┼──────┤       │  │
│  │ │ 小明 │ xx001 │ Scratch班 │编辑删除│  │
│  │ └─────┴──────┴──────┴──────┘       │  │
│  └─────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.2 学生工作台页面结构

```
┌─────────────────────────────────────────────┐
│  [Logo] 乐造AI    学生: 小明  [退出]      │
├─────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ 我的课程│ │ 我的作业│ │ 我的作品│    │
│  └─────────┘ └─────────┘ └─────────┘    │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐ ┌──────────────┐        │
│  │ 🎨 Scratch  │ │ 🐍 Python   │        │
│  │ 基础第一课   │ │ 基础第一课   │        │
│  │ 45分钟      │ │ 60分钟      │        │
│  │ [开始学习]   │ │ [开始学习]   │        │
│  └──────────────┘ └──────────────┘        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 四、API设计

### 4.1 用户管理API

```javascript
// 获取所有用户（老师）
GET /api/users?role=student

// 添加用户
POST /api/users
{ username, password, role, name, classId }

// 更新用户
PUT /api/users/:id
{ name, classId, role }

// 删除用户
DELETE /api/users/:id
```

### 4.2 班级管理API

```javascript
// 获取所有班级
GET /api/classes

// 创建班级
POST /api/classes
{ className, teacherId }

// 更新班级
PUT /api/classes/:id
{ className, studentIds }

// 删除班级
DELETE /api/classes/:id
```

### 4.3 作业管理API

```javascript
// 获取作业列表
GET /api/homeworks?classId=xxx

// 创建作业
POST /api/homeworks
{ title, description, courseId, classId, deadline }

// 提交作业
POST /api/homeworks/:id/submit
{ studentId, content }

// 评分
PUT /api/homeworks/:id/grade
{ studentId, score, comment }
```

### 4.4 作品管理API

```javascript
// 获取作品列表
GET /api/projects?userId=xxx

// 创建作品
POST /api/projects
{ name, type, content }

// 更新作品
PUT /api/projects/:id
{ name, content }

// 删除作品
DELETE /api/projects/:id
```

---

## 五、开发步骤

### Step 1: 完善老师工作台 - 学生管理
1. 创建学生列表页面
2. 实现添加/编辑/删除学生功能
3. 连接LocalStorage数据

### Step 2: 完善老师工作台 - 班级管理
1. 创建班级列表页面
2. 实现创建/编辑/删除班级
3. 实现分配学生到班级

### Step 3: 完善学生工作台
1. 展示可用课程
2. 展示待完成作业
3. 展示已有作品

### Step 4: Scratch编辑器
1. 集成 scratch-gui
2. 实现作品保存/加载

### Step 5: Python编辑器
1. 集成 Pyodide
2. 实现代码运行

---

## 六、验收标准

### 老师工作台
- [ ] 可以查看所有学生
- [ ] 可以添加新学生
- [ ] 可以编辑学生信息
- [ ] 可以删除学生
- [ ] 可以创建班级
- [ ] 可以分配学生到班级

### 学生工作台
- [ ] 可以查看所有课程
- [ ] 可以查看待完成作业
- [ ] 可以查看自己的作品

### 编辑器
- [ ] Scratch可以正常打开
- [ ] 可以保存作品
- [ ] 可以加载作品
- [ ] Python可以运行代码
