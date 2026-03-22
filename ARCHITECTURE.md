# 乐造AI教育平台 - 架构设计

> 更新：2026-03-22

---

## 1. 系统架构图

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        客户端 (Browser)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ index    │ │ dashboard│ │ student  │ │ admin-dashboard │   │
│  │ .html    │ │ .html    │ │-index    │ │ .html           │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘   │
│       │            │            │                 │             │
│       └────────────┴─────┬──────┴─────────────────┘             │
│                          │                                      │
│                    ┌─────▼─────┐                                │
│                    │  JS API   │                                │
│                    │ (api.js)  │                                │
│                    └─────┬─────┘                                │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTP/HTTPS
┌──────────────────────────┼──────────────────────────────────────┐
│                     后端 Server                                  │
│                    ┌─────▼─────┐                                │
│                    │ Express   │                                │
│                    │  :8080    │                                │
│                    └─────┬─────┘                                │
│         ┌────────────────┼────────────────┐                     │
│   ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐               │
│   │ Auth API  │   │ User API  │   │ Course API│               │
│   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘               │
│         │                │                │                      │
│   ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐               │
│   │JWT/Bcrypt │   │  Users    │   │ Courses   │               │
│   └───────────┘   └─────┬─────┘   └─────┬─────┘               │
│                         │                │                      │
└─────────────────────────┼───────────────┼──────────────────────┘
                          │               │
                    ┌─────▼─────┐   ┌─────▼─────┐
                    │ PostgreSQL │   │  Uploads  │
                    │  Database  │   │  Folder   │
                    └────────────┘   └───────────┘
```

### 1.2 技术架构

```
┌─────────────────────────────────────────────┐
│              Presentation Layer             │
│  (HTML5 + CSS3 + Vanilla JavaScript)        │
├─────────────────────────────────────────────┤
│              Business Logic Layer           │
│           (Express.js Router)               │
├─────────────────────────────────────────────┤
│                 Data Access Layer            │
│              (pg - PostgreSQL)              │
├─────────────────────────────────────────────┤
│                  Data Layer                  │
│            (PostgreSQL + LocalFS)           │
└─────────────────────────────────────────────┘
```

---

## 2. 数据流设计

### 2.1 用户登录流程

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  用户    │     │  前端    │     │  后端    │     │  数据库   │
│  输入    │────▶│  验证    │────▶│  验证    │────▶│  查询    │
│  账号    │     │  表单    │     │  JWT     │     │  密码    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                         │
                    ┌────────────────────┘
                    ▼
               ┌──────────┐
               │ 返回Token │
               │ 跳转页面  │
               └──────────┘
```

### 2.2 数据请求流程

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  前端    │     │  验证    │     │  业务    │     │  数据库   │
│  发起   │────▶│  Token   │────▶│  处理    │────▶│  操作    │
│  请求   │     │         │     │         │     │         │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                                       │
     │               ┌───────────────────────┘
     ▼               ▼
┌──────────┐     ┌──────────┐
│  展示    │     │  错误    │
│  数据    │     │  处理    │
└──────────┘     └──────────┘
```

---

## 3. API 设计

### 3.1 API 基础信息

| 项目 | 值 |
|------|-----|
| 基础URL | `/api` |
| 协议 | HTTP/HTTPS |
| 认证方式 | JWT Bearer Token |
| 数据格式 | JSON |

### 3.2 认证接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | /api/auth/login | 用户登录 | ✅ |
| POST | /api/auth/register | 用户注册 | ⏳ |
| POST | /api/auth/logout | 用户登出 | ⏳ |
| GET | /api/auth/me | 获取当前用户 | ⏳ |

### 3.3 用户管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | /api/users | 获取用户列表 | ✅ |
| GET | /api/users/:id | 获取用户详情 | ✅ |
| POST | /api/users | 创建用户 | ✅ |
| PUT | /api/users/:id | 更新用户 | ✅ |
| DELETE | /api/users/:id | 删除用户 | ✅ |

### 3.4 课程管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | /api/courses | 获取课程列表 | ✅ |
| GET | /api/courses/:id | 获取课程详情 | ✅ |
| POST | /api/courses | 创建课程 | ✅ |
| PUT | /api/courses/:id | 更新课程 | ✅ |
| DELETE | /api/courses/:id | 删除课程 | ✅ |

### 3.5 作业管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | /api/homeworks | 获取作业列表 | ⏳ |
| POST | /api/homeworks | 发布作业 | ⏳ |
| PUT | /api/homeworks/:id | 批改作业 | ⏳ |

### 3.6 作品管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | /api/projects | 获取作品列表 | ⏳ |
| POST | /api/projects | 提交作品 | ⏳ |
| PUT | /api/projects/:id | 审核作品 | ⏳ |

### 3.7 班级管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | /api/classes | 获取班级列表 | ⏳ |
| POST | /api/classes | 创建班级 | ⏳ |
| PUT | /api/classes/:id | 更新班级 | ⏳ |
| DELETE | /api/classes/:id | 删除班级 | ⏳ |

### 3.8 文件上传接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | /api/upload | 上传文件 | ✅ |

---

## 4. 数据库设计

### 4.1 表结构

#### users 表（用户）

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  nickname TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### courses 表（课程）

```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  teacher_id INTEGER,
  duration INTEGER DEFAULT 0,
  level TEXT DEFAULT '入门',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### enrollments 表（选课）

```sql
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'enrolled',
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### projects 表（作品）

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  course_id INTEGER,
  name TEXT NOT NULL,
  file_path TEXT,
  cover_path TEXT,
  description TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### homeworks 表（作业）

```sql
CREATE TABLE homeworks (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  teacher_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### homework_submissions 表（作业提交）

```sql
CREATE TABLE homework_submissions (
  id SERIAL PRIMARY KEY,
  homework_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  content TEXT,
  file_path TEXT,
  status TEXT DEFAULT 'submitted',
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### classes 表（班级）

```sql
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_id INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### class_students 表（班级学生）

```sql
CREATE TABLE class_students (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 ER 图

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│  users   │       │ courses  │       │ classes  │
├──────────┤       ├──────────┤       ├──────────┤
│ id (PK)  │◀──────│ teacher  │       │ id (PK)  │
│ username │       │   _id    │       │ name     │
│ password │       ├──────────┤       │ teacher  │
│ role     │       │ id (PK)  │       │   _id    │
│ nickname │       │ title    │       └────┬─────┘
│ avatar   │       │ desc     │            │
└────┬─────┘       │ cover    │       ┌────▼─────┐
     │             │ level    │       │class_    │
     │             │ status   │       │students  │
     │             └──────────┘       ├──────────┤
     │                │               │ class_id │
     │                │               │student_id│
     │                │               └────┬─────┘
     │                │                    │
     ▼                ▼                    ▼
┌──────────┐   ┌──────────┐         ┌──────────┐
│projects  │   │enroll    │         │  users   │
├──────────┤   │ments     │         │ (student)│
│ id (PK)  │   ├──────────┤         └──────────┘
│ user_id  │   │course_id │
│ course_id│   │student_id│
│ name     │   │progress  │
│ status   │   └──────────┘
└──────────┘
```

---

## 5. 目录结构

```
lezao-education-platform/
├── index.html                    # 统一登录页
├── dashboard.html                # 老师工作台
├── student-index.html            # 学生端首页
├── admin-dashboard.html          # 管理后台
├── python-editor.html            # Python编辑器
├── scratch-editor.html           # Scratch编辑器
│
├── server.js                     # Express后端入口
├── package.json                  # 依赖配置
│
├── js/                           # 前端JavaScript
│   ├── api.js                    # API接口封装
│   ├── auth.js                   # 认证工具
│   └── feishu-api.js             # 飞书API（预留）
│
├── css/                          # 样式文件
│   └── *.css
│
├── assets/                       # 静态资源
│   └── *
│
├── uploads/                      # 上传文件目录
│   └── *
│
├── docs/                         # 项目文档
│   ├── DEVELOPMENT.md
│   ├── SKILLS.md
│   └── REORGANIZE.md
│
└── node_modules/                 # 依赖包
    └── *
```

---

## 6. 安全设计

### 6.1 认证安全

- JWT Token认证
- Token过期时间: 24小时
- 密码BCrypt加密存储（10轮）

### 6.2 API安全

- CORS跨域配置
- SQL参数化查询防注入
- 请求频率限制（可选）

### 6.3 数据安全

- 用户密码加密存储
- 敏感信息不返回前端
- 文件上传类型限制

---

## 7. 部署架构

### 7.1 开发环境

```
本地: http://localhost:8080
```

### 7.2 生产环境

```
Railway: https://lezao-pingtai.up.railway.app
数据库: Neon PostgreSQL
```

---

*文档版本：1.0*
*最后更新：2026-03-22*
