/**
 * utils.js — funções utilitárias genéricas.
 */

const Utils = {
  clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  },

  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randFloat(min, max) {
    return Math.random() * (max - min) + min;
  },

  chance(probability0to1) {
    return Math.random() < probability0to1;
  },

  pick(array) {
    return array[Utils.randInt(0, array.length - 1)];
  },

  uid() {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  },

  qs(selector, root = document) {
    return root.querySelector(selector);
  },

  qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  },

  el(tag, className, html) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  },

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  },

  safeLocalStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn('LocalStorage indisponível (get):', e);
      return null;
    }
  },

  safeLocalStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('LocalStorage indisponível (set):', e);
      return false;
    }
  },

  safeLocalStorageRemove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  toBase64(str) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return '';
    }
  },

  fromBase64(b64) {
    try {
      return decodeURIComponent(escape(atob(b64)));
    } catch (e) {
      return null;
    }
  },

  now() {
    return Date.now();
  }
};
