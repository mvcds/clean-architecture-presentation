const storage = {
  read<T = unknown>(key: string, defaultValue?: T): T | null {
    const content = localStorage.getItem(key);

    if (content) {
      return JSON.parse(content);
    }

    if (defaultValue) {
      storage.write(key, defaultValue);
      return defaultValue;
    }

    return null;
  },
  write<T = unknown>(key: string, value: T): void {
    const content = JSON.stringify(value);
    localStorage.setItem(key, content);
  },
};

export default storage;
