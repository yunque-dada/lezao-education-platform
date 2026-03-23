// API Client - 前后端通信
const API_BASE_URL = ''; // 空字符串表示使用相对路径

const API = {
    // 通用请求方法
    async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        // 添加认证Token
        const token = localStorage.getItem('token');
        if (token) {
            options.headers['Authorization'] = 'Bearer ' + token;
        }
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(API_BASE_URL + endpoint, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || '请求失败');
        }
        
        return result;
    },
    
    // 认证相关
    auth: {
        async login(username, password) {
            return API.request('/api/auth/login', 'POST', { username, password });
        },
        async logout() {
            return API.request('/api/auth/logout', 'POST');
        },
        async getUser() {
            return API.request('/api/auth/me', 'GET');
        }
    },
    
    // 学生相关
    students: {
        list() {
            return API.request('/api/students', 'GET');
        },
        get(id) {
            return API.request('/api/students/' + id, 'GET');
        },
        create(data) {
            return API.request('/api/students', 'POST', data);
        },
        update(id, data) {
            return API.request('/api/students/' + id, 'PUT', data);
        },
        delete(id) {
            return API.request('/api/students/' + id, 'DELETE');
        }
    },
    
    // 课程相关
    courses: {
        list() {
            return API.request('/api/courses', 'GET');
        },
        get(id) {
            return API.request('/api/courses/' + id, 'GET');
        },
        create(data) {
            return API.request('/api/courses', 'POST', data);
        },
        update(id, data) {
            return API.request('/api/courses/' + id, 'PUT', data);
        },
        delete(id) {
            return API.request('/api/courses/' + id, 'DELETE');
        }
    },
    
    // 作业相关
    homeworks: {
        list() {
            return API.request('/api/homeworks', 'GET');
        },
        create(data) {
            return API.request('/api/homeworks', 'POST', data);
        },
        update(id, data) {
            return API.request('/api/homeworks/' + id, 'PUT', data);
        },
        delete(id) {
            return API.request('/api/homeworks/' + id, 'DELETE');
        }
    },
    
    // 作品相关
    works: {
        list() {
            return API.request('/api/works', 'GET');
        },
        create(data) {
            return API.request('/api/works', 'POST', data);
        },
        update(id, data) {
            return API.request('/api/works/' + id, 'PUT', data);
        },
        delete(id) {
            return API.request('/api/works/' + id, 'DELETE');
        }
    }
};

// APIClient 别名（兼容旧代码）
const APIClient = API;
