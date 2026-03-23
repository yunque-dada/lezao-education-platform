// Auth - 本地认证管理
const Auth = {
    // 检查是否已登录
    isLoggedIn() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },
    
    // 获取当前用户
    getUser() {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    },
    
    // 保存登录信息
    saveLogin(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },
    
    // 清除登录信息
    clearLogin() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    
    // 检查角色权限
    hasRole(role) {
        const user = this.getUser();
        return user && user.role === role;
    },
    
    // 是否是管理员
    isAdmin() {
        return this.hasRole('admin');
    },
    
    // 是否是老师
    isTeacher() {
        return this.hasRole('teacher');
    },
    
    // 是否是学生
    isStudent() {
        return this.hasRole('student');
    }
};

// 导出到全局
window.Auth = Auth;
