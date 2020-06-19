import _ from 'lodash';

const storage_ttl_key_suffix = '__ttl__';
export const storage = (key, value, ttl) => {
  if (typeof value === 'undefined') {
    //get
    const ttl_key = key + storage_ttl_key_suffix;
    const oldTtl = localStorage.getItem(ttl_key) || 0;
    if (oldTtl > 0 && oldTtl < Date.now()) {
      localStorage.removeItem(ttl_key);
      localStorage.removeItem(key);
      return undefined;
    }
    const cache = localStorage.getItem(key);
    if (cache == null) return cache;
    try {
      return JSON.parse(cache);
    } catch (e) {
      return cache;
    }
  } else if (value == null) {
    // clear
    localStorage.removeItem(key + storage_ttl_key_suffix);
    localStorage.removeItem(key);
  } else {
    // set
    //const cache = Json.stringify(value);
    const cache = value;
    localStorage.setItem(key, cache);
    if (ttl > 0) {
      const expire = Date.now() + ttl;
      localStorage.setItem(key + storage_ttl_key_suffix, expire);
    }
  }
};

// importAll(require.context('../components/', true, /\.js$/));
export const importAll = r => r.keys().forEach(r);
