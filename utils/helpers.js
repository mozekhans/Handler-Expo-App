// import { Platform, Linking, Alert } from 'react-native';
// import * as FileSystem from 'expo-file-system';
// import * as Clipboard from 'expo-clipboard';
// import * as Sharing from 'expo-sharing';
// import * as Network from 'expo-network';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


// export const helpers = {
//   // Deep clone object
//   deepClone: (obj) => {
//     return JSON.parse(JSON.stringify(obj));
//   },

//   // Check if object is empty
//   isEmptyObject: (obj) => {
//     return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
//   },

//   // Debounce function
//   debounce: (func, wait) => {
//     let timeout;
//     return function executedFunction(...args) {
//       const later = () => {
//         clearTimeout(timeout);
//         func(...args);
//       };
//       clearTimeout(timeout);
//       timeout = setTimeout(later, wait);
//     };
//   },

//   // Throttle function
//   throttle: (func, limit) => {
//     let inThrottle;
//     return function(...args) {
//       if (!inThrottle) {
//         func.apply(this, args);
//         inThrottle = true;
//         setTimeout(() => inThrottle = false, limit);
//       }
//     };
//   },

//   // Group array by key
//   groupBy: (array, key) => {
//     return array.reduce((result, item) => {
//       const groupKey = typeof key === 'function' ? key(item) : item[key];
//       if (!result[groupKey]) {
//         result[groupKey] = [];
//       }
//       result[groupKey].push(item);
//       return result;
//     }, {});
//   },

//   // Sort array by key
//   sortBy: (array, key, order = 'asc') => {
//     return [...array].sort((a, b) => {
//       const aVal = typeof key === 'function' ? key(a) : a[key];
//       const bVal = typeof key === 'function' ? key(b) : b[key];
      
//       if (order === 'asc') {
//         return aVal > bVal ? 1 : -1;
//       } else {
//         return aVal < bVal ? 1 : -1;
//       }
//     });
//   },

//   // Unique array
//   unique: (array, key = null) => {
//     if (!key) {
//       return [...new Set(array)];
//     }
    
//     const seen = new Set();
//     return array.filter(item => {
//       const value = item[key];
//       if (seen.has(value)) return false;
//       seen.add(value);
//       return true;
//     });
//   },

//   // Chunk array
//   chunk: (array, size) => {
//     const chunks = [];
//     for (let i = 0; i < array.length; i += size) {
//       chunks.push(array.slice(i, i + size));
//     }
//     return chunks;
//   },

//   // Flatten array
//   flatten: (array) => {
//     return array.reduce((flat, item) => {
//       return flat.concat(Array.isArray(item) ? helpers.flatten(item) : item);
//     }, []);
//   },

//   // Intersection of arrays
//   intersection: (...arrays) => {
//     return arrays.reduce((a, b) => a.filter(c => b.includes(c)));
//   },

//   // Difference of arrays
//   difference: (a, b) => {
//     return a.filter(x => !b.includes(x));
//   },

//   // Random number between min and max
//   randomInt: (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   },

//   // Random string
//   randomString: (length = 8) => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < length; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   },

//   // Generate UUID
//   generateUUID: () => {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//       const r = Math.random() * 16 | 0;
//       const v = c === 'x' ? r : (r & 0x3 | 0x8);
//       return v.toString(16);
//     });
//   },

//   // Slugify string
//   slugify: (str) => {
//     return str
//       .toLowerCase()
//       .replace(/[^\w\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/--+/g, '-')
//       .trim();
//   },

//   // Truncate text
//   truncate: (str, length = 100, suffix = '...') => {
//     if (str.length <= length) return str;
//     return str.substring(0, length) + suffix;
//   },

//   // Capitalize first letter
//   capitalize: (str) => {
//     if (!str) return '';
//     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//   },

//   // Title case
//   titleCase: (str) => {
//     if (!str) return '';
//     return str
//       .toLowerCase()
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   },

//   // Extract numbers from string
//   extractNumbers: (str) => {
//     const matches = str.match(/\d+/g);
//     return matches ? matches.map(Number) : [];
//   },

//   // Extract emails from string
//   extractEmails: (str) => {
//     const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
//     return str.match(emailRegex) || [];
//   },

//   // Extract URLs from string
//   extractUrls: (str) => {
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return str.match(urlRegex) || [];
//   },

//   // Parse query string
//   parseQueryString: (query) => {
//     const params = new URLSearchParams(query);
//     const result = {};
//     for (const [key, value] of params) {
//       result[key] = value;
//     }
//     return result;
//   },

//   // Build query string
//   buildQueryString: (params) => {
//     return Object.keys(params)
//       .filter(key => params[key] !== null && params[key] !== undefined)
//       .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
//       .join('&');
//   },

//  // Copy to clipboard (updated)
//   copyToClipboard: async (text) => {
//     try {
//       await Clipboard.setStringAsync(text);
//       return true;
//     } catch {
//       return false;
//     }
//   },

//   // Share content (updated)
//   shareContent: async (options) => {
//     try {
//       if (options.url && await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(options.url, {
//           mimeType: options.type,
//           dialogTitle: options.title,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       if (!error.message?.includes('CANCELLED')) {
//         console.error('Share error:', error);
//       }
//       return false;
//     }
//   },

//   // Download file (updated)
//   downloadFile: async (url, fileName) => {
//     try {
//       const downloadDest = `${FileSystem.documentDirectory}${fileName}`;
//       const downloadResult = await FileSystem.downloadAsync(url, downloadDest);
      
//       if (downloadResult.status === 200) {
//         return downloadResult.uri;
//       }
//       return null;
//     } catch (error) {
//       console.error('Download error:', error);
//       return null;
//     }
//   },

//   // Check network connection (updated)
//   isConnected: async () => {
//     try {
//       const networkState = await Network.getNetworkStateAsync();
//       return networkState.isConnected;
//     } catch {
//       return false;
//     }
//   },

//   // Get connection type (updated)
//   getConnectionType: async () => {
//     try {
//       const networkState = await Network.getNetworkStateAsync();
//       return networkState.type;
//     } catch {
//       return null;
//     }
//   },

//   // Get file extension
//   getFileExtension: (filename) => {
//     return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
//   },

//   // Get file name without extension
//   getFileName: (filename) => {
//     return filename.substring(0, filename.lastIndexOf('.')) || filename;
//   },

//   // Check if string is JSON
//   isJSON: (str) => {
//     try {
//       JSON.parse(str);
//       return true;
//     } catch {
//       return false;
//     }
//   },

//   // Safe JSON parse
//   safeJSONParse: (str, defaultValue = null) => {
//     try {
//       return JSON.parse(str);
//     } catch {
//       return defaultValue;
//     }
//   },

//   // Sleep for ms
//   sleep: (ms) => {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   },

//   // Retry function with delay
//   retry: async (fn, maxAttempts = 3, delay = 1000) => {
//     for (let i = 0; i < maxAttempts; i++) {
//       try {
//         return await fn();
//       } catch (error) {
//         if (i === maxAttempts - 1) throw error;
//         await helpers.sleep(delay * Math.pow(2, i));
//       }
//     }
//   },

//   // Memoize function
//   memoize: (fn) => {
//     const cache = new Map();
//     return (...args) => {
//       const key = JSON.stringify(args);
//       if (cache.has(key)) {
//         return cache.get(key);
//       }
//       const result = fn(...args);
//       cache.set(key, result);
//       return result;
//     };
//   },

//   // Pipe functions
//   pipe: (...fns) => {
//     return (x) => fns.reduce((v, f) => f(v), x);
//   },

//   // Compose functions
//   compose: (...fns) => {
//     return (x) => fns.reduceRight((v, f) => f(v), x);
//   },

//   // Pick object keys
//   pick: (obj, keys) => {
//     return keys.reduce((acc, key) => {
//       if (obj && obj.hasOwnProperty(key)) {
//         acc[key] = obj[key];
//       }
//       return acc;
//     }, {});
//   },

//   // Omit object keys
//   omit: (obj, keys) => {
//     const result = { ...obj };
//     keys.forEach(key => delete result[key]);
//     return result;
//   },

//   // Merge objects
//   merge: (...objects) => {
//     return Object.assign({}, ...objects);
//   },

//   // Deep merge
//   deepMerge: (target, source) => {
//     const output = { ...target };
    
//     if (helpers.isObject(target) && helpers.isObject(source)) {
//       Object.keys(source).forEach(key => {
//         if (helpers.isObject(source[key])) {
//           if (!(key in target)) {
//             output[key] = source[key];
//           } else {
//             output[key] = helpers.deepMerge(target[key], source[key]);
//           }
//         } else {
//           output[key] = source[key];
//         }
//       });
//     }
    
//     return output;
//   },

//   // Check if value is object
//   isObject: (item) => {
//     return item && typeof item === 'object' && !Array.isArray(item);
//   },

//   // Check if value is empty
//   isEmpty: (value) => {
//     if (value === null || value === undefined) return true;
//     if (typeof value === 'string') return value.trim() === '';
//     if (Array.isArray(value)) return value.length === 0;
//     if (helpers.isObject(value)) return Object.keys(value).length === 0;
//     return false;
//   },

//   // Open URL
//   openURL: async (url) => {
//     const supported = await Linking.canOpenURL(url);
//     if (supported) {
//       await Linking.openURL(url);
//       return true;
//     }
//     return false;
//   },

//   // Check permission
//   checkPermission: async (permission) => {
//     const platformPermission = Platform.select({
//       ios: PERMISSIONS.IOS[permission],
//       android: PERMISSIONS.ANDROID[permission]
//     });
    
//     if (!platformPermission) return false;
    
//     const status = await check(platformPermission);
//     return status === 'granted';
//   },

//   // Request permission
//   requestPermission: async (permission) => {
//     const platformPermission = Platform.select({
//       ios: PERMISSIONS.IOS[permission],
//       android: PERMISSIONS.ANDROID[permission]
//     });
    
//     if (!platformPermission) return false;
    
//     const status = await request(platformPermission);
//     return status === 'granted';
//   },

//   // Show alert
//   showAlert: (title, message, buttons = [{ text: 'OK' }]) => {
//     Alert.alert(title, message, buttons);
//   },

//   // Confirm action
//   confirm: (title, message, onConfirm, onCancel) => {
//     Alert.alert(
//       title,
//       message,
//       [
//         { text: 'Cancel', onPress: onCancel, style: 'cancel' },
//         { text: 'Confirm', onPress: onConfirm }
//       ]
//     );
//   }
// };

// export const {
//   deepClone,
//   isEmptyObject,
//   debounce,
//   throttle,
//   groupBy,
//   sortBy,
//   unique,
//   chunk,
//   flatten,
//   intersection,
//   difference,
//   randomInt,
//   randomString,
//   generateUUID,
//   slugify,
//   truncate,
//   capitalize,
//   titleCase,
//   extractNumbers,
//   extractEmails,
//   extractUrls,
//   parseQueryString,
//   buildQueryString,
//   copyToClipboard,
//   shareContent,
//   downloadFile,
//   isConnected,
//   getConnectionType,
//   getFileExtension,
//   getFileName,
//   isJSON,
//   safeJSONParse,
//   sleep,
//   retry,
//   memoize,
//   pipe,
//   compose,
//   pick,
//   omit,
//   merge,
//   deepMerge,
//   isObject,
//   isEmpty,
//   openURL,
//   checkPermission,
//   requestPermission,
//   showAlert,
//   confirm
// } = helpers;

















import { Platform, Linking, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as Network from 'expo-network';
// Remove the react-native-permissions import
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Add Expo permissions imports
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { requestCameraPermissionsAsync, requestMicrophonePermissionsAsync } from 'expo-camera';

export const helpers = {
  // Deep clone object
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  // Check if object is empty
  isEmptyObject: (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Group array by key
  groupBy: (array, key) => {
    return array.reduce((result, item) => {
      const groupKey = typeof key === 'function' ? key(item) : item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  },

  // Sort array by key
  sortBy: (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = typeof key === 'function' ? key(a) : a[key];
      const bVal = typeof key === 'function' ? key(b) : b[key];
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  },

  // Unique array
  unique: (array, key = null) => {
    if (!key) {
      return [...new Set(array)];
    }
    
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  },

  // Chunk array
  chunk: (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  // Flatten array
  flatten: (array) => {
    return array.reduce((flat, item) => {
      return flat.concat(Array.isArray(item) ? helpers.flatten(item) : item);
    }, []);
  },

  // Intersection of arrays
  intersection: (...arrays) => {
    return arrays.reduce((a, b) => a.filter(c => b.includes(c)));
  },

  // Difference of arrays
  difference: (a, b) => {
    return a.filter(x => !b.includes(x));
  },

  // Random number between min and max
  randomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Random string
  randomString: (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Generate UUID
  generateUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  // Slugify string
  slugify: (str) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  },

  // Truncate text
  truncate: (str, length = 100, suffix = '...') => {
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },

  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Title case
  titleCase: (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  // Extract numbers from string
  extractNumbers: (str) => {
    const matches = str.match(/\d+/g);
    return matches ? matches.map(Number) : [];
  },

  // Extract emails from string
  extractEmails: (str) => {
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
    return str.match(emailRegex) || [];
  },

  // Extract URLs from string
  extractUrls: (str) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return str.match(urlRegex) || [];
  },

  // Parse query string
  parseQueryString: (query) => {
    const params = new URLSearchParams(query);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  // Build query string
  buildQueryString: (params) => {
    return Object.keys(params)
      .filter(key => params[key] !== null && params[key] !== undefined)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
      .join('&');
  },

  // Copy to clipboard (updated)
  copyToClipboard: async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      return true;
    } catch {
      return false;
    }
  },

  // Share content (updated)
  shareContent: async (options) => {
    try {
      if (options.url && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(options.url, {
          mimeType: options.type,
          dialogTitle: options.title,
        });
        return true;
      }
      return false;
    } catch (error) {
      if (!error.message?.includes('CANCELLED')) {
        console.error('Share error:', error);
      }
      return false;
    }
  },

  // Download file (updated)
  downloadFile: async (url, fileName) => {
    try {
      const downloadDest = `${FileSystem.documentDirectory}${fileName}`;
      const downloadResult = await FileSystem.downloadAsync(url, downloadDest);
      
      if (downloadResult.status === 200) {
        return downloadResult.uri;
      }
      return null;
    } catch (error) {
      console.error('Download error:', error);
      return null;
    }
  },

  // Check network connection (updated)
  isConnected: async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      return networkState.isConnected;
    } catch {
      return false;
    }
  },

  // Get connection type (updated)
  getConnectionType: async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      return networkState.type;
    } catch {
      return null;
    }
  },

  // Get file extension
  getFileExtension: (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  // Get file name without extension
  getFileName: (filename) => {
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
  },

  // Check if string is JSON
  isJSON: (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  },

  // Safe JSON parse
  safeJSONParse: (str, defaultValue = null) => {
    try {
      return JSON.parse(str);
    } catch {
      return defaultValue;
    }
  },

  // Sleep for ms
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Retry function with delay
  retry: async (fn, maxAttempts = 3, delay = 1000) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxAttempts - 1) throw error;
        await helpers.sleep(delay * Math.pow(2, i));
      }
    }
  },

  // Memoize function
  memoize: (fn) => {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  },

  // Pipe functions
  pipe: (...fns) => {
    return (x) => fns.reduce((v, f) => f(v), x);
  },

  // Compose functions
  compose: (...fns) => {
    return (x) => fns.reduceRight((v, f) => f(v), x);
  },

  // Pick object keys
  pick: (obj, keys) => {
    return keys.reduce((acc, key) => {
      if (obj && obj.hasOwnProperty(key)) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  },

  // Omit object keys
  omit: (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  },

  // Merge objects
  merge: (...objects) => {
    return Object.assign({}, ...objects);
  },

  // Deep merge
  deepMerge: (target, source) => {
    const output = { ...target };
    
    if (helpers.isObject(target) && helpers.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (helpers.isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = helpers.deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }
    
    return output;
  },

  // Check if value is object
  isObject: (item) => {
    return item && typeof item === 'object' && !Array.isArray(item);
  },

  // Check if value is empty
  isEmpty: (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (helpers.isObject(value)) return Object.keys(value).length === 0;
    return false;
  },

  // Open URL
  openURL: async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return true;
    }
    return false;
  },

  // Check permission - UPDATED for Expo
  checkPermission: async (permission) => {
    try {
      switch (permission) {
        case 'CAMERA':
          const { status: cameraStatus } = await ImagePicker.getCameraPermissionsAsync();
          return cameraStatus === 'granted';
        case 'PHOTO_LIBRARY':
          const { status: mediaStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
          return mediaStatus === 'granted';
        case 'LOCATION':
          const { status: locationStatus } = await Location.getForegroundPermissionsAsync();
          return locationStatus === 'granted';
        case 'NOTIFICATIONS':
          const { status: notificationStatus } = await Notifications.getPermissionsAsync();
          return notificationStatus === 'granted';
        default:
          console.warn(`Permission ${permission} not implemented`);
          return false;
      }
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  },

  // Request permission - UPDATED for Expo
  requestPermission: async (permission) => {
    try {
      switch (permission) {
        case 'CAMERA':
          const result = await ImagePicker.requestCameraPermissionsAsync();
          return result.status === 'granted';
        case 'PHOTO_LIBRARY':
          const mediaResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
          return mediaResult.status === 'granted';
        case 'LOCATION':
          const locationResult = await Location.requestForegroundPermissionsAsync();
          return locationResult.status === 'granted';
        case 'NOTIFICATIONS':
          const notificationResult = await Notifications.requestPermissionsAsync();
          return notificationResult.status === 'granted';
        default:
          console.warn(`Permission ${permission} not implemented`);
          return false;
      }
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  },

  // Show alert
  showAlert: (title, message, buttons = [{ text: 'OK' }]) => {
    Alert.alert(title, message, buttons);
  },

  // Confirm action
  confirm: (title, message, onConfirm, onCancel) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', onPress: onCancel, style: 'cancel' },
        { text: 'Confirm', onPress: onConfirm }
      ]
    );
  }
};

export const {
  deepClone,
  isEmptyObject,
  debounce,
  throttle,
  groupBy,
  sortBy,
  unique,
  chunk,
  flatten,
  intersection,
  difference,
  randomInt,
  randomString,
  generateUUID,
  slugify,
  truncate,
  capitalize,
  titleCase,
  extractNumbers,
  extractEmails,
  extractUrls,
  parseQueryString,
  buildQueryString,
  copyToClipboard,
  shareContent,
  downloadFile,
  isConnected,
  getConnectionType,
  getFileExtension,
  getFileName,
  isJSON,
  safeJSONParse,
  sleep,
  retry,
  memoize,
  pipe,
  compose,
  pick,
  omit,
  merge,
  deepMerge,
  isObject,
  isEmpty,
  openURL,
  checkPermission,
  requestPermission,
  showAlert,
  confirm
} = helpers;