/**
 * 统一 API 客户端
 * 连接前端与后端 REST API (PostgreSQL)
 */

const API_BASE_URL = ''; // 空字符串表示同源请求

// Token 管理
const Auth = {
    // 获取 token
    getToken() {
        return localStorage.getItem('lezhao_token');
    },

    // 保存 token 和用户信息
    setAuth(token, user) {
        localStorage.setItem('lezhao_token', token);
        localStorage.setItem('lezhao_user', JSON.stringify(user));
    },

    // 获取用户信息
    getUser() {
        const userStr = localStorage.getItem('lezhao_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // 清除登录信息
    clearAuth() {
        localStorage.removeItem('lezhao_token');
        localStorage.removeItem('lezhao_user');
    },

    // 检查是否已登录
    isLoggedIn() {
        return !!this.getToken();
    }
};

// 通用请求方法
async function request(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        // 处理 401 未授权
        if (response.status === 401) {
            Auth.clearAuth();
            window.location.href = 'index.html';
            throw new Error('登录已过期');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || '请求失败');
        }

        return data;
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
}

// ========== 认证 API ==========
const AuthAPI = {
    // 登录
    async login(username, password) {
        const data = await request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        if (data.token) {
            Auth.setAuth(data.token, data.user);
        }
        return data;
    },

    // 注册
    async register(username, password, nickname, role = 'student') {
        const data = await request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password, nickname, role })
        });
        return data;
    },

    // 获取当前用户信息
    async getUser() {
        return await request('/api/auth/user');
    },

    // 退出登录
    logout() {
        Auth.clearAuth();
        window.location.href = 'index.html';
    }
};

// ========== 课程 API ==========
const CourseAPI = {
    // 获取所有课程
    async list() {
        return await request('/api/courses');
    },

    // 获取课程详情
    async get(id) {
        return await request(`/api/courses/${id}`);
    },

    // 老师获取自己的课程
    async getTeacherCourses() {
        return await request('/api/teacher/courses');
    },

    // 管理员创建课程
    async create(courseData) {
        return await request('/api/admin/courses', {
            method: 'POST',
            body: JSON.stringify(courseData)
        });
    },

    // 管理员更新课程
    async update(id, courseData) {
        return await request(`/api/admin/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(courseData)
        });
    },

    // 管理员删除课程
    async delete(id) {
        return await request(`/api/admin/courses/${id}`, {
            method: 'DELETE'
        });
    }
};

// ========== 报名 API ==========
const EnrollmentAPI = {
    // 报名课程
    async enroll(courseId) {
        return await request('/api/student/enroll', {
            method: 'POST',
            body: JSON.stringify({ course_id: courseId })
        });
    },

    // 获取已报名课程
    async myCourses() {
        return await request('/api/student/my-courses');
    }
};

// ========== 作品 API ==========
const ProjectAPI = {
    // 获取我的作品
    async list() {
        return await request('/api/projects');
    },

    // 保存作品
    async save(projectData) {
        // 如果有文件，使用 FormData
        if (projectData.file) {
            const formData = new FormData();
            formData.append('file', projectData.file);
            if (projectData.name) formData.append('name', projectData.name);
            if (projectData.description) formData.append('description', projectData.description);
            if (projectData.projectId) formData.append('projectId', projectData.projectId);
            if (projectData.course_id) formData.append('course_id', projectData.course_id);
            if (projectData.status) formData.append('status', projectData.status);

            const token = Auth.getToken();
            const response = await fetch(`${API_BASE_URL}/api/projects`, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || '保存失败');
            }
            return await response.json();
        }

        return await request('/api/projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    },

    // 老师获取待审核作品
    async getTeacherProjects() {
        return await request('/api/teacher/projects');
    },

    // 老师审核作品
    async review(id, status) {
        return await request(`/api/teacher/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }
};

// ========== 管理员 API ==========
const AdminAPI = {
    // 获取仪表盘数据
    async getDashboard() {
        return await request('/api/admin/dashboard');
    },

    // 获取所有用户
    async getUsers() {
        return await request('/api/admin/users');
    },

    // 创建用户
    async createUser(userData) {
        return await request('/api/admin/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // 更新用户
    async updateUser(id, userData) {
        return await request(`/api/admin/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    // 删除用户
    async deleteUser(id) {
        return await request(`/api/admin/users/${id}`, {
            method: 'DELETE'
        });
    }
};

// ========== 导出统一客户端 ==========
const APIClient = {
    auth: AuthAPI,
    courses: CourseAPI,
    enrollments: EnrollmentAPI,
    projects: ProjectAPI,
    admin: AdminAPI,
    user: Auth
};

// ========== 全局 API 别名（兼容旧代码） ==========
// 为前端页面提供统一的 API 访问入口
const API = {
    students: {
        list: () => {
            const data = localStorage.getItem('lezhao_students');
            return data ? JSON.parse(data) : [];
        },
        create: (data) => {
            const students = API.students.list();
            const newStudent = { studentId: 'student-' + Date.now(), ...data };
            students.push(newStudent);
            localStorage.setItem('lezhao_students', JSON.stringify(students));
            return { success: true, student: newStudent };
        },
        delete: (id) => {
            let students = API.students.list();
            students = students.filter(s => s.studentId !== id);
            localStorage.setItem('lezhao_students', JSON.stringify(students));
            return { success: true };
        },
        get: (id) => {
            const students = API.students.list();
            return students.find(s => s.studentId === id) || null;
        }
    },
    works: {
        list: () => {
            const data = localStorage.getItem('lezhao_works');
            return data ? JSON.parse(data) : [];
        },
        create: (data) => {
            const works = API.works.list();
            const newWork = { workId: 'work-' + Date.now(), ...data };
            works.push(newWork);
            localStorage.setItem('lezhao_works', JSON.stringify(works));
            return { success: true, work: newWork };
        },
        update: (id, data) => {
            let works = API.works.list();
            const index = works.findIndex(w => w.workId === id);
            if (index !== -1) {
                works[index] = { ...works[index], ...data };
                localStorage.setItem('lezhao_works', JSON.stringify(works));
            }
            return { success: true };
        }
    },
    courses: {
        list: () => {
            const data = localStorage.getItem('lezhao_courses');
            return data ? JSON.parse(data) : [];
        }
    }
};

// 兼容旧版 API（localStorage）- 保留用于降级或迁移过渡
const LegacyAPI = {
    students: {
        list: () => JSON.parse(localStorage.getItem('lezhao_students') || '[]'),
        get: (id) => {
            const students = JSON.parse(localStorage.getItem('lezhao_students') || '[]');
            return students.find(s => s.studentId === id);
        }
    },
    teachers: {
        list: () => JSON.parse(localStorage.getItem('lezhao_teachers') || '[]')
    },
    courses: {
        list: () => JSON.parse(localStorage.getItem('lezhao_courses') || '[]')
    },
    works: {
        list: () => JSON.parse(localStorage.getItem('lezhao_works') || '[]')
    },
    classes: {
        list: () => JSON.parse(localStorage.getItem('lezhao_classes') || '[]')
    }
};
