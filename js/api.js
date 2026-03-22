/**
 * 飞书API封装（本地模拟版）
 * 暂时使用LocalStorage，后续可接入真实飞书API
 */

// 本地存储配置
const LocalConfig = {
  usersKey: 'lezhao_users',
  classesKey: 'lezhao_classes'
};

// 本地模拟API
const LocalAPI = {
  // 初始化默认用户
  init() {
    if (!localStorage.getItem(LocalConfig.usersKey)) {
      // 默认账号 (密码: lezhao123 的SHA256)
      const defaultUsers = [
        {
          userId: 'admin-001',
          username: 'admin',
          password: '2f006414af1d55a66f3240c9900dcb8d5eca2cc5fa452128803800400934c2bf',
          role: 'admin',
          name: '超级管理员',
          createdAt: Date.now(),
          lastLogin: null
        },
        {
          userId: 'teacher-001',
          username: 'teacher1',
          password: '2f006414af1d55a66f3240c9900dcb8d5eca2cc5fa452128803800400934c2bf',
          role: 'teacher',
          name: '乐造老师',
          classId: '',
          createdAt: Date.now(),
          lastLogin: null
        },
        {
          userId: 'student-001',
          username: 'student1',
          password: '2f006414af1d55a66f3240c9900dcb8d5eca2cc5fa452128803800400934c2bf',
          role: 'student',
          name: '李浚源',
          classId: '',
          createdAt: Date.now(),
          lastLogin: null
        }
      ];
      localStorage.setItem(LocalConfig.usersKey, JSON.stringify(defaultUsers));
    }
    
    if (!localStorage.getItem(LocalConfig.classesKey)) {
      const defaultClasses = [
        { classId: 'class-scratch-basic', className: 'Scratch基础班', teacherId: 'teacher-001' },
        { classId: 'class-scratch-advanced', className: 'Scratch进阶班', teacherId: 'teacher-001' },
        { classId: 'class-python-basic', className: 'Python基础班', teacherId: 'teacher-001' }
      ];
      localStorage.setItem(LocalConfig.classesKey, JSON.stringify(defaultClasses));
    }
  },
  
  // 获取所有用户
  getUsers() {
    this.init();
    return JSON.parse(localStorage.getItem(LocalConfig.usersKey) || '[]');
  },
  
  // 根据用户名获取用户
  getUserByUsername(username) {
    const users = this.getUsers();
    return users.find(u => u.username === username) || null;
  },
  
  // 创建用户
  createUser(userData) {
    const users = this.getUsers();
    users.push(userData);
    localStorage.setItem(LocalConfig.usersKey, JSON.stringify(users));
    return userData;
  },
  
  // 更新用户
  updateUser(username, fields) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
      users[index] = { ...users[index], ...fields };
      localStorage.setItem(LocalConfig.usersKey, JSON.stringify(users));
      return users[index];
    }
    return null;
  },
  
  // 获取班级
  getClasses() {
    this.init();
    return JSON.parse(localStorage.getItem(LocalConfig.classesKey) || '[]');
  }
};

// ========== 学生管理 ==========
const StudentAPI = {
  STORAGE_KEY: 'lezhao_students',
  
  // 初始化
  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      // 添加一些示例学生
      const demoStudents = [
        {
          studentId: 'student-001',
          username: 'zhangxm',
          password: '2f006414af1d55a66f3240c9900dcb8d5eca2cc5fa452128803800400934c2bf',
          name: '张小明',
          gender: '男',
          age: 10,
          phone: '13800138000',
          parentPhone: '13900139000',
          classId: 'class-scratch-basic',
          courseIds: ['course-scratch-1'],
          progress: 75,
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          studentId: 'student-002',
          username: 'lixh',
          password: '2f006414af1d55a66f3240c9900dcb8d5eca2cc5fa452128803800400934c2bf',
          name: '李小红',
          gender: '女',
          age: 11,
          phone: '13800138001',
          parentPhone: '13900139001',
          classId: 'class-python-basic',
          courseIds: ['course-python-1'],
          progress: 45,
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          studentId: 'student-003',
          username: 'wangxm',
          password: '2f006414af1d55a66f3240c9900dcb8d5eca2cc5fa452128803800400934c2bf',
          name: '王小明',
          gender: '男',
          age: 12,
          phone: '13800138002',
          parentPhone: '13900139002',
          classId: 'class-web-basic',
          courseIds: ['course-web-1'],
          progress: 90,
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demoStudents));
    }
  },
  
  // 获取所有学生
  getAll() {
    this.init();
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },
  
  // 获取学生by ID
  getById(studentId) {
    const students = this.getAll();
    return students.find(s => s.studentId === studentId) || null;
  },
  
  // 获取学生by username
  getByUsername(username) {
    const students = this.getAll();
    return students.find(s => s.username === username) || null;
  },
  
  // 创建学生
  create(data) {
    this.init();
    const students = this.getAll();
    
    // 检查用户名唯一
    if (this.getByUsername(data.username)) {
      return { success: false, error: '用户名已存在' };
    }
    
    const newStudent = {
      studentId: 'student-' + Date.now(),
      username: data.username,
      password: data.password || '2f006414af1d55a66f3240c9900dcb8d5eca2cc5fa452128803800400934c2bf', // 默认密码
      name: data.name,
      gender: data.gender || '',
      age: data.age || '',
      phone: data.phone || '',
      parentPhone: data.parentPhone || '',
      classId: data.classId || '',
      courseIds: data.courseIds || [],
      progress: 0,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    students.push(newStudent);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(students));
    return { success: true, data: newStudent };
  },
  
  // 更新学生
  update(studentId, data) {
    const students = this.getAll();
    const index = students.findIndex(s => s.studentId === studentId);
    if (index === -1) {
      return { success: false, error: '学生不存在' };
    }
    
    // 检查用户名唯一（排除自己）
    if (data.username && data.username !== students[index].username) {
      if (this.getByUsername(data.username)) {
        return { success: false, error: '用户名已存在' };
      }
    }
    
    students[index] = { 
      ...students[index], 
      ...data, 
      updatedAt: Date.now() 
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(students));
    return { success: true, data: students[index] };
  },
  
  // 删除学生
  delete(studentId) {
    const students = this.getAll();
    const filtered = students.filter(s => s.studentId !== studentId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  },
  
  // 批量删除
  batchDelete(studentIds) {
    const students = this.getAll();
    const filtered = students.filter(s => !studentIds.includes(s.studentId));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  }
};

// ========== 老师管理 API ==========
const TeacherAPI = {
  STORAGE_KEY: 'lezhao_teachers',
  
  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const demoTeachers = [
        {
          teacherId: 'teacher-001',
          username: 'teacher1',
          password: '2f006414af1d55a66f3240c9900dcb8d5eca2cc5fa452128803800400934c2bf',
          name: '乐造老师',
          gender: '男',
          phone: '13800138000',
          intro: '资深Scratch编程讲师',
          courseIds: ['course-scratch-1', 'course-scratch-2'],
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          teacherId: 'teacher-002',
          username: 'teacher2',
          password: '2f006414af1d55a66f3240c9900dcb8d5eca2cc5fa452128803800400934c2bf',
          name: 'Python老师',
          gender: '女',
          phone: '13800138001',
          intro: 'Python编程专家',
          courseIds: ['course-python-1'],
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demoTeachers));
    }
  },
  
  getAll() {
    this.init();
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },
  
  getById(teacherId) {
    const teachers = this.getAll();
    return teachers.find(t => t.teacherId === teacherId) || null;
  },
  
  getByUsername(username) {
    const teachers = this.getAll();
    return teachers.find(t => t.username === username) || null;
  },
  
  create(data) {
    this.init();
    const teachers = this.getAll();
    
    if (this.getByUsername(data.username)) {
      return { success: false, error: '用户名已存在' };
    }
    
    const newTeacher = {
      teacherId: 'teacher-' + Date.now(),
      username: data.username,
      password: data.password || '2f006414af1d55a66f3240c9900dcb8d5eca2cc5fa452128803800400934c2bf',
      name: data.name,
      gender: data.gender || '',
      phone: data.phone || '',
      intro: data.intro || '',
      courseIds: data.courseIds || [],
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    teachers.push(newTeacher);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(teachers));
    return { success: true, data: newTeacher };
  },
  
  update(teacherId, data) {
    const teachers = this.getAll();
    const index = teachers.findIndex(t => t.teacherId === teacherId);
    if (index === -1) {
      return { success: false, error: '老师不存在' };
    }
    
    if (data.username && data.username !== teachers[index].username) {
      if (this.getByUsername(data.username)) {
        return { success: false, error: '用户名已存在' };
      }
    }
    
    teachers[index] = { ...teachers[index], ...data, updatedAt: Date.now() };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(teachers));
    return { success: true, data: teachers[index] };
  },
  
  delete(teacherId) {
    const teachers = this.getAll();
    const filtered = teachers.filter(t => t.teacherId !== teacherId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  },
  
  // 批量删除
  batchDelete(teacherIds) {
    const teachers = this.getAll();
    const filtered = teachers.filter(t => !teacherIds.includes(t.teacherId));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  }
};

// ========== 课程管理 API ==========
const CourseAPI = {
  STORAGE_KEY: 'lezhao_courses',
  
  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const demoCourses = [
        {
          courseId: 'course-scratch-1',
          name: 'Scratch编程基础',
          description: 'Scratch入门课程，适合零基础学生',
          category: 'scratch',
          difficulty: '入门',
          coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
          teacherId: 'teacher-001',
          chapters: [
            { id: 1, title: '初识Scratch', duration: '30分钟' },
            { id: 2, title: '角色与背景', duration: '40分钟' },
            { id: 3, title: '积木块编程', duration: '50分钟' }
          ],
          studentCount: 120,
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          courseId: 'course-python-1',
          name: 'Python入门',
          description: 'Python编程入门课程',
          category: 'python',
          difficulty: '入门',
          coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
          teacherId: 'teacher-002',
          chapters: [
            { id: 1, title: 'Python安装', duration: '20分钟' },
            { id: 2, title: '变量与数据类型', duration: '40分钟' }
          ],
          studentCount: 80,
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          courseId: 'course-web-1',
          name: 'Web前端基础',
          description: 'HTML/CSS/JavaScript入门',
          category: 'web',
          difficulty: '基础',
          coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
          teacherId: 'teacher-001',
          chapters: [],
          studentCount: 50,
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demoCourses));
    }
  },
  
  getAll() {
    this.init();
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },
  
  getById(courseId) {
    const courses = this.getAll();
    return courses.find(c => c.courseId === courseId) || null;
  },
  
  create(data) {
    this.init();
    const courses = this.getAll();
    
    const newCourse = {
      courseId: 'course-' + Date.now(),
      name: data.name,
      description: data.description || '',
      category: data.category || 'scratch',
      difficulty: data.difficulty || '入门',
      coverImage: data.coverImage || '',
      teacherId: data.teacherId || '',
      chapters: [],
      studentCount: 0,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    courses.push(newCourse);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(courses));
    return { success: true, data: newCourse };
  },
  
  update(courseId, data) {
    const courses = this.getAll();
    const index = courses.findIndex(c => c.courseId === courseId);
    if (index === -1) {
      return { success: false, error: '课程不存在' };
    }
    
    courses[index] = { ...courses[index], ...data, updatedAt: Date.now() };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(courses));
    return { success: true, data: courses[index] };
  },
  
  delete(courseId) {
    const courses = this.getAll();
    const filtered = courses.filter(c => c.courseId !== courseId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  },
  
  // 批量删除
  batchDelete(courseIds) {
    const courses = this.getAll();
    const filtered = courses.filter(c => !courseIds.includes(c.courseId));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  }
};

// ========== 作品管理 API ==========
const WorkAPI = {
  STORAGE_KEY: 'lezhao_works',
  
  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const demoWorks = [
        {
          workId: 'work-001',
          name: '超级玛丽游戏',
          type: 'scratch',
          studentId: 'student-001',
          url: 'https://scratch.mit.edu/projects/123456',
          thumbnail: '',
          score: 5,
          comment: '很棒的作品！',
          status: 'approved',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          workId: 'work-002',
          name: '计算器小程序',
          type: 'python',
          studentId: 'student-002',
          url: '',
          thumbnail: '',
          score: 0,
          comment: '',
          status: 'pending',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          workId: 'work-003',
          name: '个人网页',
          type: 'web',
          studentId: 'student-003',
          url: '',
          thumbnail: '',
          score: 0,
          comment: '',
          status: 'pending',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demoWorks));
    }
  },
  
  getAll() {
    this.init();
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },
  
  getById(workId) {
    const works = this.getAll();
    return works.find(w => w.workId === workId) || null;
  },
  
  create(data) {
    this.init();
    const works = this.getAll();
    
    const newWork = {
      workId: 'work-' + Date.now(),
      name: data.name,
      type: data.type || 'scratch',
      studentId: data.studentId,
      url: data.url || '',
      thumbnail: data.thumbnail || '',
      score: 0,
      comment: '',
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    works.push(newWork);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(works));
    return { success: true, data: newWork };
  },
  
  update(workId, data) {
    const works = this.getAll();
    const index = works.findIndex(w => w.workId === workId);
    if (index === -1) {
      return { success: false, error: '作品不存在' };
    }
    
    works[index] = { ...works[index], ...data, updatedAt: Date.now() };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(works));
    return { success: true, data: works[index] };
  },
  
  delete(workId) {
    const works = this.getAll();
    const filtered = works.filter(w => w.workId !== workId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  },
  
  // 审核作品
  approve(workId, score, comment) {
    return this.update(workId, { status: 'approved', score, comment });
  },
  
  // 拒绝作品
  reject(workId) {
    return this.update(workId, { status: 'rejected' });
  },
  
  // 批量删除
  batchDelete(workIds) {
    const works = this.getAll();
    const filtered = works.filter(w => !workIds.includes(w.workId));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  }
};

// ========== 班级管理 API ==========
const ClassAPI = {
  STORAGE_KEY: 'lezhao_classes',
  
  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const demoClasses = [
        { classId: 'class-scratch-basic', className: 'Scratch基础班', teacherId: 'teacher-001', courseId: 'course-scratch-1', studentIds: ['student-001'], createdAt: Date.now() },
        { classId: 'class-python-basic', className: 'Python基础班', teacherId: 'teacher-002', courseId: 'course-python-1', studentIds: ['student-002'], createdAt: Date.now() },
        { classId: 'class-web-basic', className: 'Web前端班', teacherId: 'teacher-001', courseId: 'course-web-1', studentIds: ['student-003'], createdAt: Date.now() }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demoClasses));
    }
  },
  
  getAll() {
    this.init();
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },
  
  getById(classId) {
    const classes = this.getAll();
    return classes.find(c => c.classId === classId) || null;
  },
  
  create(data) {
    this.init();
    const classes = this.getAll();
    const newClass = {
      classId: 'class-' + Date.now(),
      className: data.className,
      teacherId: data.teacherId || '',
      courseId: data.courseId || '',
      studentIds: [],
      createdAt: Date.now()
    };
    classes.push(newClass);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(classes));
    return { success: true, data: newClass };
  },
  
  update(classId, data) {
    const classes = this.getAll();
    const index = classes.findIndex(c => c.classId === classId);
    if (index === -1) return { success: false, error: '班级不存在' };
    classes[index] = { ...classes[index], ...data };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(classes));
    return { success: true, data: classes[index] };
  },
  
  delete(classId) {
    const classes = this.getAll();
    const filtered = classes.filter(c => c.classId !== classId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  },
  
  // 批量删除
  batchDelete(classIds) {
    const classes = this.getAll();
    const filtered = classes.filter(c => !classIds.includes(c.classId));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  }
};

// ========== 统一API接口（兼容各模块调用）==========
const API = {
  // 学生
  students: {
    list: () => StudentAPI.getAll(),
    get: (id) => StudentAPI.getById(id),
    create: (data) => StudentAPI.create(data),
    update: (id, data) => StudentAPI.update(id, data),
    delete: (id) => StudentAPI.delete(id),
    batchDelete: (ids) => StudentAPI.batchDelete(ids)
  },
  // 老师
  teachers: {
    list: () => TeacherAPI.getAll(),
    get: (id) => TeacherAPI.getById(id),
    create: (data) => TeacherAPI.create(data),
    update: (id, data) => TeacherAPI.update(id, data),
    delete: (id) => TeacherAPI.delete(id),
    batchDelete: (ids) => TeacherAPI.batchDelete(ids)
  },
  // 课程
  courses: {
    list: () => CourseAPI.getAll(),
    get: (id) => CourseAPI.getById(id),
    create: (data) => CourseAPI.create(data),
    update: (id, data) => CourseAPI.update(id, data),
    delete: (id) => CourseAPI.delete(id),
    batchDelete: (ids) => CourseAPI.batchDelete(ids)
  },
  // 作品
  works: {
    list: () => WorkAPI.getAll(),
    get: (id) => WorkAPI.getById(id),
    create: (data) => WorkAPI.create(data),
    update: (id, data) => WorkAPI.update(id, data),
    delete: (id) => WorkAPI.delete(id),
    batchDelete: (ids) => WorkAPI.batchDelete(ids)
  },
  // 班级
  classes: {
    list: () => ClassAPI.getAll(),
    get: (id) => ClassAPI.getById(id),
    create: (data) => ClassAPI.create(data),
    update: (id, data) => ClassAPI.update(id, data),
    delete: (id) => ClassAPI.delete(id),
    batchDelete: (ids) => ClassAPI.batchDelete(ids)
  }
};

// 登录服务
const AuthService = {
  // 登录（role可选，不传则不验证角色）
  async login(username, password, role) {
    // 查找用户
    const user = LocalAPI.getUserByUsername(username);
    
    if (!user) {
      return { success: false, error: '用户名不存在' };
    }
    
    // 验证角色（如果传了role才验证）
    if (role && user.role !== role) {
      return { success: false, error: '角色选择错误' };
    }
    
    // 验证密码
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { success: false, error: '密码错误' };
    }
    
    // 生成Token
    const token = generateUUID();
    
    // 更新最后登录时间
    LocalAPI.updateUser(username, { lastLogin: Date.now() });
    
    return {
      success: true,
      user: {
        userId: user.userId,
        username: user.username,
        role: user.role,
        name: user.name,
        classId: user.classId
      },
      token
    };
  },
  
  // 注册（学生）
  async register(username, password, name, classId) {
    // 检查用户名是否已存在
    const existingUser = LocalAPI.getUserByUsername(username);
    if (existingUser) {
      return { success: false, error: '用户名已存在' };
    }
    
    // 加密密码
    const hashedPassword = await hashPassword(password);
    
    // 创建用户
    const userData = {
      userId: generateUUID(),
      username: username,
      password: hashedPassword,
      role: 'student',
      name: name,
      classId: classId || '',
      createdAt: Date.now(),
      lastLogin: null
    };
    
    LocalAPI.createUser(userData);
    
    // 生成Token
    const token = generateUUID();
    
    return {
      success: true,
      user: {
        userId: userData.userId,
        username: userData.username,
        role: userData.role,
        name: userData.name,
        classId: userData.classId
      },
      token
    };
  },
  
  // 获取班级列表
  getClasses() {
    return LocalAPI.getClasses();
  }
};
