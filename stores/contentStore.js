// services/storage/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  async getItem(key, parse = true) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value && parse) {
        return JSON.parse(value);
      }
      return value;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
}

export const storage = new Storage();
export default storage;