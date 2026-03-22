const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'education-platform-secret-key-2024';

// 检查是否配置了数据库
const DATABASE_URL = process.env.DATABASE_URL;
const hasDatabase = !!DATABASE_URL;

// PostgreSQL 连接配置
let pool = null;
if (hasDatabase) {
  console.log('🔗 正在连接数据库...');
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  
  // 测试数据库连接
  pool.on('error', (err) => {
    console.error('⚠️ 数据库连接错误:', err.message);
  });
}

// 初始化数据库表
async function initDatabase() {
  if (!hasDatabase) {
    console.log('⚠️ 未配置 DATABASE_URL，使用本地存储模式（开发模式）');
    console.log('💡 生产部署请在 Railway 上添加 PostgreSQL 插件并设置 DATABASE_URL');
    return false;
  }
  
  try {
    console.log('📦 正在初始化数据库表...');
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'student',
          nickname TEXT,
          avatar TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS courses (
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
        CREATE TABLE IF NOT EXISTS enrollments (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL,
          course_id INTEGER NOT NULL,
          progress INTEGER DEFAULT 0,
          status TEXT DEFAULT 'enrolled',
          enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS projects (
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
      `);
      console.log('✅ 数据库表初始化完成');
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ 数据库初始化失败:', err.message);
    console.error('💡 请检查 Railway 上的 DATABASE_URL 环境变量是否正确');
    return false;
  }
}

const bcrypt = require('bcryptjs');

async function initDefaultData() {
  if (!hasDatabase || !pool) {
    console.log('⏭️ 跳过默认数据初始化（无数据库）');
    return;
  }
  
  try {
    // 测试连接
    await pool.query('SELECT 1');
    console.log('✅ 数据库连接测试成功');
    
    // 创建默认管理员
    const adminResult = await pool.query("SELECT * FROM users WHERE username = 'admin'");
    if (adminResult.rows.length === 0) {
      const hash = bcrypt.hashSync('123456', 10);
      await pool.query(
        'INSERT INTO users (username, password, role, nickname) VALUES ($1, $2, $3, $4)',
        ['admin', hash, 'admin', '管理员']
      );
      console.log('✅ 默认管理员: admin / 123456');
    }

    // 创建示例课程
    const courseResult = await pool.query('SELECT COUNT(*) as cnt FROM courses');
    if (parseInt(courseResult.rows[0].cnt) === 0) {
      await pool.query(
        "INSERT INTO courses (title, description, level, duration, status) VALUES ($1, $2, $3, $4, $5)",
        ['Scratch趣味编程', '适合零基础学员，通过拖拽式编程培养逻辑思维', '入门', 20, 'published']
      );
      await pool.query(
        "INSERT INTO courses (title, description, level, duration, status) VALUES ($1, $2, $3, $4, $5)",
        ['Python基础', 'Python编程入门，学习变量、循环、函数等基础概念', '入门', 30, 'published']
      );
      console.log('✅ 示例课程已创建');
    }
    console.log('✅ 数据库初始化完成');
  } catch (err) {
    console.error('❌ 初始化数据失败:', err.message);
  }
}

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(path.join(uploadsDir, 'projects'))) fs.mkdirSync(path.join(uploadsDir, 'projects'));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

// 健康检查端点
app.get('/health', async (req, res) => {
  try {
    let dbStatus = 'disconnected';
    if (pool) {
      await pool.query('SELECT 1');
      dbStatus = 'connected';
    }
    res.json({ status: 'ok', database: dbStatus, timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => res.json({status:'ok', time:new Date()}));
app.get('/', (req, res) => res.send('Education Platform API Running'));

// 注册
app.post('/api/auth/register', async (req, res) => {
  const {username, password, role='student', nickname} = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role, nickname) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, hashed, role, nickname||username]
    );
    res.json({message:'注册成功', userId:result.rows[0].id});
  } catch(e) { 
    console.error(e);
    res.status(500).json({error:'注册失败，用户名可能已存在'}); 
  }
});

// 登录
app.post('/api/auth/login', async (req, res) => {
  const {username, password} = req.body;
  const jwt = require('jsonwebtoken');
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({error:'用户不存在'});
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if(!valid) return res.status(401).json({error:'密码错误'});
    const token = jwt.sign({id:user.id, username:user.username, role:user.role}, JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user:{id:user.id, username:user.username, role:user.role, nickname:user.nickname}});
  } catch(e) {
    console.error(e);
    res.status(500).json({error:'登录失败'});
  }
});

// 获取用户信息
app.get('/api/auth/user', async (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.replace('Bearer ', '');
  if(!token) return res.status(401).json({error:'请先登录'});
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT id, username, role, nickname, avatar FROM users WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) return res.status(404).json({error:'用户不存在'});
    res.json(result.rows[0]);
  } catch(e) { res.status(401).json({error:'登录已过期'}); }
});

// 管理员中间件
const requireAdmin = async (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.replace('Bearer ', '');
  if(!token) return res.status(401).json({error:'请先登录'});
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if(decoded.role !== 'admin') return res.status(403).json({error:'需要管理员权限'});
    req.adminUser = decoded;
    next();
  } catch(e) { res.status(401).json({error:'登录已过期'}); }
};

// 老师中间件
const requireTeacher = async (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.replace('Bearer ', '');
  if(!token) return res.status(401).json({error:'请先登录'});
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if(decoded.role !== 'admin' && decoded.role !== 'teacher') return res.status(403).json({error:'需要老师权限'});
    req.user = decoded;
    next();
  } catch(e) { res.status(401).json({error:'登录已过期'}); }
};

// ===== 管理员API =====
// 仪表盘
app.get('/api/admin/dashboard', requireAdmin, async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) as total FROM users');
    const admins = await pool.query('SELECT COUNT(*) as c FROM users WHERE role=$1', ['admin']);
    const teachers = await pool.query('SELECT COUNT(*) as c FROM users WHERE role=$1', ['teacher']);
    const students = await pool.query('SELECT COUNT(*) as c FROM users WHERE role=$1', ['student']);
    const totalCourses = await pool.query('SELECT COUNT(*) as c FROM courses');
    const totalProjects = await pool.query('SELECT COUNT(*) as c FROM projects');
    res.json({
      totalUsers: parseInt(totalUsers.rows[0].total),
      admins: parseInt(admins.rows[0].c),
      teachers: parseInt(teachers.rows[0].c),
      students: parseInt(students.rows[0].c),
      totalCourses: parseInt(totalCourses.rows[0].c),
      totalProjects: parseInt(totalProjects.rows[0].c)
    });
  } catch(e) {
    console.error(e);
    res.status(500).json({error:'获取失败'});
  }
});

// 用户管理
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id,username,role,nickname,created_at FROM users ORDER BY id DESC');
    res.json(result.rows.map(u=>({id:u.id, username:u.username, role:u.role, nickname:u.nickname, createdAt:u.created_at})));
  } catch(e) { res.status(500).json({error:'获取失败'}); }
});

app.post('/api/admin/users', requireAdmin, async (req, res) => {
  const {username, password, role='student', nickname} = req.body;
  if(!username||!password) return res.status(400).json({error:'用户名和密码必填'});
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role, nickname) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, hashed, role, nickname||username]
    );
    res.json({message:'添加成功', userId:result.rows[0].id});
  } catch(e) { res.status(400).json({error:'用户名已存在'}); }
});

app.put('/api/admin/users/:id', requireAdmin, async (req, res) => {
  const {id} = req.params;
  const {password, role, nickname} = req.body;
  try {
    if(password) {
      const hashed = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET role=$1, password=$2, nickname=$3 WHERE id=$4', [role||'student', hashed, nickname||null, id]);
    } else {
      await pool.query('UPDATE users SET role=$1, nickname=$2 WHERE id=$3', [role||'student', nickname||null, id]);
    }
    res.json({message:'更新成功'});
  } catch(e) { res.status(500).json({error:'更新失败'}); }
});

app.delete('/api/admin/users/:id', requireAdmin, async (req, res) => {
  const {id} = req.params;
  if(parseInt(id) === req.adminUser.id) return res.status(400).json({error:'不能删除自己'});
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    res.json({message:'删除成功'});
  } catch(e) { res.status(500).json({error:'删除失败'}); }
});

// ===== 课程API =====
// 课程列表
app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT c.*, u.nickname as teacher_name FROM courses c LEFT JOIN users u ON c.teacher_id = u.id WHERE c.status = $1 ORDER BY c.id DESC',
      ['published']
    );
    res.json(result.rows);
  } catch(e) { res.status(500).json({error:'获取失败'}); }
});

// 课程详情
app.get('/api/courses/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT c.*, u.nickname as teacher_name FROM courses c LEFT JOIN users u ON c.teacher_id = u.id WHERE c.id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({error:'课程不存在'});
    res.json(result.rows[0]);
  } catch(e) { res.status(500).json({error:'获取失败'}); }
});

// 老师课程管理
app.get('/api/teacher/courses', requireTeacher, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query('SELECT c.*, u.nickname as teacher_name FROM courses c LEFT JOIN users u ON c.teacher_id = u.id ORDER BY c.id DESC');
    } else {
      result = await pool.query(
        'SELECT c.*, u.nickname as teacher_name FROM courses c LEFT JOIN users u ON c.teacher_id = u.id WHERE c.teacher_id = $1 ORDER BY c.id DESC',
        [req.user.id]
      );
    }
    res.json(result.rows);
  } catch(e) { res.status(500).json({error:'获取失败'}); }
});

app.post('/api/admin/courses', requireAdmin, async (req, res) => {
  const {title, description, cover_image, teacher_id, duration, level} = req.body;
  if(!title) return res.status(400).json({error:'课程标题必填'});
  try {
    const result = await pool.query(
      'INSERT INTO courses (title, description, cover_image, teacher_id, duration, level, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [title, description||'', cover_image||'', teacher_id||null, duration||0, level||'入门', 'published']
    );
    res.json({message:'创建成功', courseId:result.rows[0].id});
  } catch(e) { res.status(500).json({error:'创建失败'}); }
});

app.put('/api/admin/courses/:id', requireAdmin, async (req, res) => {
  const {title, description, cover_image, teacher_id, duration, level, status} = req.body;
  try {
    await pool.query(
      'UPDATE courses SET title=$1, description=$2, cover_image=$3, teacher_id=$4, duration=$5, level=$6, status=$7 WHERE id=$8',
      [title, description, cover_image, teacher_id, duration, level, status, req.params.id]
    );
    res.json({message:'更新成功'});
  } catch(e) { res.status(500).json({error:'更新失败'}); }
});

app.delete('/api/admin/courses/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE id=$1', [req.params.id]);
    res.json({message:'删除成功'});
  } catch(e) { res.status(500).json({error:'删除失败'}); }
});

// ===== 报名API =====
// 报名课程
app.post('/api/student/enroll', async (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.replace('Bearer ', '');
  if(!token) return res.status(401).json({error:'请先登录'});
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const {course_id} = req.body;
    if(!course_id) return res.status(400).json({error:'课程ID必填'});
    
    const existing = await pool.query(
      'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [decoded.id, course_id]
    );
    if(existing.rows.length > 0) return res.status(400).json({error:'已报名此课程'});
    
    await pool.query('INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)', [decoded.id, course_id]);
    res.json({message:'报名成功'});
  } catch(e) { res.status(500).json({error:'报名失败'}); }
});

// 我的课程
app.get('/api/student/my-courses', async (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.replace('Bearer ', '');
  if(!token) return res.status(401).json({error:'请先登录'});
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      "SELECT e.*, c.title, c.description, c.cover_image, c.level, c.duration FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = $1 ORDER BY e.enrolled_at DESC",
      [decoded.id]
    );
    res.json(result.rows);
  } catch(e) { res.status(500).json({error:'获取失败'}); }
});

// ===== 作品API =====
// 获取作品
app.get('/api/projects', async (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.replace('Bearer ', '');
  if(!token) return res.status(401).json({error:'请先登录'});
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      'SELECT p.*, u.username FROM projects p JOIN users u ON p.user_id = u.id WHERE p.user_id = $1 ORDER BY p.updated_at DESC',
      [decoded.id]
    );
    res.json(result.rows);
  } catch(e) { res.status(500).json({error:'获取失败'}); }
});

// 老师待审核作品
app.get('/api/teacher/projects', requireTeacher, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT p.*, u.username, c.title as course_title FROM projects p JOIN users u ON p.user_id = u.id LEFT JOIN courses c ON p.course_id = c.id WHERE p.status = 'pending' ORDER BY p.created_at DESC"
    );
    res.json(result.rows);
  } catch(e) { res.status(500).json({error:'获取失败'}); }
});

// 保存作品
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(uploadsDir, 'projects')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random()*1E9) + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/api/projects', upload.single('file'), async (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.replace('Bearer ', '');
  if(!token) return res.status(401).json({error:'请先登录'});
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const {name, description, projectId, course_id, status} = req.body;
    const filePath = req.file ? '/uploads/projects/' + req.file.filename : null;
    
    if(projectId) {
      await pool.query(
        'UPDATE projects SET name=$1, file_path=$2, description=$3, status=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 AND user_id=$6',
        [name, filePath, description, status||'draft', projectId, decoded.id]
      );
      res.json({message:'更新成功', projectId});
    } else {
      const result = await pool.query(
        'INSERT INTO projects (user_id, course_id, name, file_path, description, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [decoded.id, course_id||null, name, filePath, description, status||'draft']
      );
      res.json({message:'保存成功', projectId:result.rows[0].id});
    }
  } catch(e) { res.status(500).json({error:'保存失败'}); }
});

// 审核作品
app.put('/api/teacher/projects/:id', requireTeacher, async (req, res) => {
  const {status} = req.body;
  if(!status) return res.status(400).json({error:'状态必填'});
  try {
    await pool.query('UPDATE projects SET status=$1 WHERE id=$2', [status, req.params.id]);
    res.json({message:'审核成功'});
  } catch(e) { res.status(500).json({error:'审核失败'}); }
});

// 启动服务器
async function startServer() {
  console.log('🚀 正在启动教育平台服务...');
  console.log(`📍 监听端口: ${PORT}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
  
  try {
    const dbReady = await initDatabase();
    
    if (dbReady) {
      await initDefaultData();
    } else {
      console.log('⚠️ 服务运行在无数据库模式，部分功能可能不可用');
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log('✅ 教育平台服务已启动!');
      console.log(`🌐 访问地址: http://0.0.0.0:${PORT}`);
      console.log(`🔐 健康检查: http://0.0.0.0:${PORT}/api/health`);
      console.log('='.repeat(50));
    });
  } catch (err) {
    console.error('❌ 启动失败:', err.message);
    console.log('⚠️ 尝试启动服务（无数据库模式）...');
    app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log('⚠️ 教育平台服务已启动（无数据库模式）');
      console.log(`🌐 访问地址: http://0.0.0.0:${PORT}`);
      console.log('='.repeat(50));
    });
  }
}

startServer();
