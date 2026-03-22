/**
 * 本地存储 + 飞书双存储
 * 飞书功能暂时使用本地存储，后续可以接入飞书API
 */

const HybridAPI = {
  // 学生
  students: {
    async list() {
      return API.students.list();
    },
    async create(data) {
      return API.students.create(data);
    },
    async update(id, data) {
      return API.students.update(id, data);
    },
    async delete(id) {
      return API.students.delete(id);
    },
    get(id) {
      const list = API.students.list();
      return list.find(s => s.studentId === id);
    }
  },
  
  // 老师
  teachers: {
    async list() {
      return API.teachers.list();
    },
    async create(data) {
      return API.teachers.create(data);
    }
  },
  
  // 课程
  courses: {
    async list() {
      return API.courses.list();
    },
    async create(data) {
      return API.courses.create(data);
    }
  },
  
  // 作品
  works: {
    async list() {
      return API.works.list();
    },
    async create(data) {
      return API.works.create(data);
    },
    async update(id, data) {
      return API.works.update(id, data);
    },
    async delete(id) {
      return API.works.delete(id);
    },
    get(id) {
      const list = API.works.list();
      return list.find(w => w.workId === id);
    }
  }
};
