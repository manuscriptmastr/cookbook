/**
 * Decorator to persist an accessor with session or local storage.
 * ```ts
 * class MyClass {
 *   @persist('show-dialog')
 *   accessor showDialog = false;
 * }
 * ```
 */
export const persist =
  (key, store = sessionStorage) =>
  () => ({
    init(initialValue) {
      if (store.getItem(key) === null) {
        store.setItem(key, JSON.stringify(initialValue));
      }
    },
    get() {
      return JSON.parse(store.getItem(key));
    },
    set(value) {
      store.setItem(key, JSON.stringify(value));
    },
  });
