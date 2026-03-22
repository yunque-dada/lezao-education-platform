/**
 * 密码加密工具
 * 使用SHA-256加密
 */

// 加密密码
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 验证密码
async function verifyPassword(password, hashedPassword) {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

// 生成UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 本地存储操作
const Storage = {
  // 保存登录信息
  setAuth(user, token, remember = false) {
    const expires = remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7天或1天
    const authData = {
      token,
      userId: user.userId,
      username: user.username,
      role: user.role,
      name: user.name,
      expires: Date.now() + expires
    };
    localStorage.setItem('lezhao_auth', JSON.stringify(authData));
  },
  
  // 获取登录信息
  getAuth() {
    const authStr = localStorage.getItem('lezhao_auth');
    if (!authStr) return null;
    
    const auth = JSON.parse(authStr);
    if (auth.expires < Date.now()) {
      localStorage.removeItem('lezhao_auth');
      return null;
    }
    return auth;
  },
  
  // 清除登录信息
  clearAuth() {
    localStorage.removeItem('lezhao_auth');
  },
  
  // 检查是否已登录
  isLoggedIn() {
    return this.getAuth() !== null;
  }
};
