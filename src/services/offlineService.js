import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@grandstay_cache_';
const QUEUE_KEY = '@grandstay_pending_writes';

export const getCache = async (key) => {
  try {
    const data = await AsyncStorage.getItem(CACHE_PREFIX + key);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.value;
    }
    return null;
  } catch {
    return null;
  }
};

export const setCache = async (key, value) => {
  try {
    await AsyncStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ value, timestamp: Date.now() })
    );
  } catch {
    // Silently fail cache write
  }
};

export const clearCache = async (key) => {
  try {
    await AsyncStorage.removeItem(CACHE_PREFIX + key);
  } catch {
    // Silently fail
  }
};

export const queueWrite = async (operation) => {
  try {
    const existing = await AsyncStorage.getItem(QUEUE_KEY);
    const queue = existing ? JSON.parse(existing) : [];
    queue.push({ ...operation, queuedAt: Date.now() });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // Silently fail
  }
};

export const getPendingWrites = async () => {
  try {
    const data = await AsyncStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const clearPendingWrites = async () => {
  try {
    await AsyncStorage.removeItem(QUEUE_KEY);
  } catch {
    // Silently fail
  }
};

export const syncPendingWrites = async (executeFn) => {
  const pending = await getPendingWrites();
  if (pending.length === 0) return;

  const failed = [];
  for (const op of pending) {
    try {
      await executeFn(op);
    } catch {
      failed.push(op);
    }
  }

  if (failed.length > 0) {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
  } else {
    await clearPendingWrites();
  }
};

export default {
  getCache,
  setCache,
  clearCache,
  queueWrite,
  getPendingWrites,
  clearPendingWrites,
  syncPendingWrites,
};
