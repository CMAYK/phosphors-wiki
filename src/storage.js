// src/storage.js
export const storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return { key, value, shared: false };
      }
      return null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return { key, value, shared: false };
    } catch (error) {
      console.error('Storage set error:', error);
      return null;
    }
  },

  async delete(key) {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    } catch (error) {
      console.error('Storage delete error:', error);
      return null;
    }
  },

  async list(prefix) {
    try {
      const keys = Object.keys(localStorage)
        .filter(key => !prefix || key.startsWith(prefix));
      return { keys, prefix, shared: false };
    } catch (error) {
      console.error('Storage list error:', error);
      return { keys: [], shared: false };
    }
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  window.storage = storage;
}