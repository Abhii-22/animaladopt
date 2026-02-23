const fs = require('fs');
const path = require('path');

// Simple file-based database for testing
class FileDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, '../data.json');
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.dbPath)) {
        return JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
      }
      return { users: [] };
    } catch (error) {
      return { users: [] };
    }
  }

  saveData() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
  }

  // User methods
  async createUser(userData) {
    const user = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(user);
    this.saveData();
    return user;
  }

  async findOne(query) {
    if (query.email) {
      return this.data.users.find(user => user.email === query.email);
    }
    if (query._id) {
      return this.data.users.find(user => user._id === query._id);
    }
    return null;
  }

  async findById(id) {
    return this.data.users.find(user => user._id === id);
  }

  async findByIdAndUpdate(id, updateData) {
    const userIndex = this.data.users.findIndex(user => user._id === id);
    if (userIndex !== -1) {
      this.data.users[userIndex] = { ...this.data.users[userIndex], ...updateData };
      this.saveData();
      return this.data.users[userIndex];
    }
    return null;
  }

  async deleteOne(query) {
    if (query.email) {
      const index = this.data.users.findIndex(user => user.email === query.email);
      if (index !== -1) {
        this.data.users.splice(index, 1);
        this.saveData();
        return true;
      }
    }
    return false;
  }
}

const db = new FileDatabase();
module.exports = db;
