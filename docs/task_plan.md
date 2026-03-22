# 学生端开发计划

> 日期：2026-03-21
> 项目：lezao-education-platform
> 目标：完善学生端功能

---

## 功能清单

| 序号 | 功能 | 状态 | 优先级 |
|------|------|------|--------|
| 1 | 账号登录 | 待开发 | P0 |
| 2 | 在线 Scratch | 已完成 | P0 |
| 3 | 在线 Python | 已完成 | P0 |
| 4 | 我的作品 | 待开发 | P1 |
| 5 | 我的课程 | 待开发 | P1 |

---

## Phase 1: 账号登录系统

### 任务清单
- [x] 1.1 登录页面美化
- [x] 1.2 登录逻辑（localStorage）
- [ ] 1.3 注册页面
- [x] 1.4 退出登录
- [x] 1.5 记住密码

### 技术方案
- 使用 localStorage 存储用户信息
- 测试账号：student1/123456

### 完成状态
✅ Phase 1 账号登录系统已完成！

---

## Phase 2: 在线编程（已完成）

### Scratch 3.0
- [x] 2.1 嵌入官方编辑器
- [x] 2.2 iframe 嵌入方式

### Python 编辑器
- [x] 3.1 代码编辑器
- [x] 3.2 运行按钮
- [x] 3.3 输出显示

---

## Phase 3: 我的作品

### 任务清单
- [ ] 3.1 作品列表展示
- [ ] 3.2 作品卡片设计
- [ ] 3.3 作品详情页
- [ ] 3.4 删除作品
- [ ] 3.5 作品保存（localStorage）

### 数据结构
```javascript
{
  id: "project-001",
  name: "我的第一个游戏",
  type: "scratch" | "python",
  content: "...",
  cover: "base64或url",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## Phase 4: 我的课程

### 任务清单
- [ ] 4.1 课程列表展示
- [ ] 4.2 课程卡片设计
- [ ] 4.3 课程详情页
- [ ] 4.4 学习进度记录
- [ ] 4.5 课程分类（Scratch/Python）

### 数据结构
```javascript
{
  id: "course-001",
  name: "Scratch基础入门",
  type: "scratch",
  level: "入门",
  cover: "url",
  duration: 20, // 课时
  progress: 0, // 完成进度百分比
  lessons: [...]
}
```

---

## 开发顺序

1. **先完成 Phase 1** - 账号登录（基础）
2. **Phase 2** - 在线编程（已有雏形）
3. **Phase 3** - 我的作品
4. **Phase 4** - 我的课程

---

## 当前状态

- [x] 学生端页面框架
- [x] Scratch 3.0 嵌入
- [x] Python 编辑器
- [ ] 登录功能完善
- [ ] 作品管理
- [ ] 课程展示

---

## 下一步

从 Phase 1 开始：账号登录系统
