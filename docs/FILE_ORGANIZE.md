# 项目文件整理计划

> 日期：2026-03-21
> 目标：整理文件结构，不损坏功能

---

## 当前文件结构

```
根目录文件（混乱）：
├── index.html              # 登录页 ✅ 保留
├── dashboard.html         # 老师端 ✅ 保留
├── admin-dashboard.html  # 管理后台 ✅ 保留
├── student-index.html   # 学生端 ✅ 保留
├── python-editor.html   # Python编辑器 ✅ 保留
├── scratch-editor.html  # Scratch编辑器 ✅ 保留
├── register.html        # ❌ 可删除
├── scratch-test.html    # ❌ 可删除
├── findings.md         # ❌ 移到docs
├── SPEC.md             # ❌ 移到docs
├── task_plan.md        # ❌ 移到docs
├── README.md           # ❌ 保留或替换
├── README_FILE.md      # ❌ 替换README
├── package.json       # ❌ 可删除
├── railway.json        # ❌ 保留
│
├── pages/              # 新建：页面文件夹
├── docs/              # ✅ 已有：文档
├── js/                # ✅ 已有：脚本
├── css/               # ✅ 已有：样式
└── assets/            # ✅ 已有：资源
```

---

## 整理方案

### Step 1: 创建 pages 文件夹，移动页面文件
```
pages/
├── login.html         # 登录页（原 index.html）
├── teacher.html       # 老师端（原 dashboard.html）
├── admin.html        # 管理后台（原 admin-dashboard.html）
├── student.html      # 学生端（原 student-index.html）
├── python.html       # Python编辑器（原 python-editor.html）
└── scratch.html      # Scratch编辑器（原 scratch-editor.html）
```

### Step 2: 移动文档
```
docs/
├── README.md         # 项目说明
├── DEVELOPMENT.md    # 开发文档
├── SKILLS.md         # 技能学习
├── REORGANIZE.md     # 整理计划
├── findings.md       # （原）
├── SPEC.md           # （原）
└── task_plan.md     # （原）
```

### Step 3: 删除不需要的文件
- register.html
- scratch-test.html
- package.json（如果没用）

---

## 重要：保持功能正常

**关键点：文件移动后需要更新引用路径！**

### 需要修改的地方：
1. index.html 跳转到 pages/teacher.html
2. 各页面的 js/ 引用路径
3. js/api.js 的基础路径

### 移动后验证：
- [ ] 登录功能正常
- [ ] 老师端正常
- [ ] 管理后台正常
- [ ] 学生端正常

---

## 执行顺序

1. 先备份当前文件
2. 创建 pages 文件夹
3. 复制文件到新位置
4. 修改引用路径
5. 测试功能
6. 删除旧文件

---

## 状态
- [ ] 开始整理
