# 乐造AI管理后台 - 功能设计方案

## 数据结构

### 1. 学生 (students)
```javascript
{
  studentId: string,      // 学生ID
  username: string,      // 用户名（唯一）
  password: string,      // 密码
  name: string,          // 姓名
  gender: string,       // 性别
  age: number,          // 年龄
  phone: string,        // 电话
  parentPhone: string,  // 家长电话
  classId: string,      // 班级ID
  courseIds: string[],  // 课程ID列表
  progress: number,     // 进度%
  status: 'active' | 'inactive',
  avatar: string,       // 头像
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2. 老师 (teachers)
```javascript
{
  teacherId: string,
  username: string,
  password: string,
  name: string,
  gender: string,
  phone: string,
  intro: string,        // 简介
  courseIds: string[],
  status: 'active' | 'inactive',
  avatar: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3. 课程 (courses)
```javascript
{
  courseId: string,
  name: string,
  description: string,
  category: 'scratch' | 'python' | 'web' | 'lego',
  difficulty: '入门' | '基础' | '进阶' | '高级',
  coverImage: string,
  duration: number,      // 课时
  chapters: Chapter[],
  studentCount: number,
  status: 'active' | 'inactive',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 4. 作品 (works)
```javascript
{
  workId: string,
  title: string,
  type: 'scratch' | 'python' | 'web',
  studentId: string,
  studentName: string,
  url: string,          // 作品链接
  thumbnail: string,     // 缩略图
  description: string,
  score: number,        // 评分 1-5
  comment: string,       // 评语
  status: 'pending' | 'approved' | 'rejected',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 5. 班级 (classes)
```javascript
{
  classId: string,
  className: string,
  teacherId: string,
  courseId: string,
  studentIds: string[],
  status: 'active' | 'inactive',
  createdAt: timestamp
}
```

## 页面结构

### admin-dashboard.html
- 左侧栏：导航菜单
- 右侧主内容区：根据菜单切换不同模块

### 模块页面（页面内切换）

1. **#students** - 学生管理
   - 学生列表（表格）
   - 添加学生（弹窗）
   - 编辑学生（弹窗）
   - 删除确认（弹窗）
   - 批量导入（弹窗）

2. **#teachers** - 老师管理
   - 老师列表
   - 添加/编辑/删除

3. **#courses** - 课程管理
   - 课程列表（卡片/表格）
   - 添加/编辑课程
   - 课程详情

4. **#works** - 作品管理
   - 作品列表
   - 审核弹窗（评分+评语）

5. **#dashboard** - 数据统计（已有基础）

6. **#settings** - 系统设置
   - 修改密码

## UI组件

1. **Modal弹窗** - 通用的添加/编辑/确认弹窗
2. **Table表格** - 列表展示
3. **Form表单** - 添加/编辑
4. **Pagination分页** - 列表分页
5. **Search搜索** - 列表搜索
6. **Filter筛选** - 列表筛选

## 实现步骤

1. 修改 api.js 添加 CRUD 方法
2. 修改 admin-dashboard.html 实现各模块页面
3. 添加弹窗组件和交互逻辑

## 验收标准

- [ ] 学生管理：增删改查 + 搜索 + 筛选
- [ ] 老师管理：增删改查
- [ ] 课程管理：增删改查
- [ ] 作品管理：查看 + 审核（评分）
- [ ] 数据统计：显示各项数据
- [ ] 设置：修改密码
