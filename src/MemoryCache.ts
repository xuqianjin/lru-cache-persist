const isFunctionLike = (obj: any) =>
  obj !== null && (typeof obj === "object" || typeof obj === "function");

export interface ICachePolicy {
  maxEntries: number;
  persist?: boolean;
}

export interface ICacheOptions {
  policy: ICachePolicy;
  namespace: string;
  persistBackend?: any;
}

class MemoryCache {
  protected memoryStore: any = {};
  protected namespace: string;
  protected persistBackend: any;
  protected persist: boolean;

  constructor(options: ICacheOptions) {
    this.namespace = options.namespace;
    this.persistBackend = options.persistBackend;
    this.persist = Boolean(options.policy?.persist);
    this.memoryStore = {};
  }

  public async loadData() {
    if (!this.persistBackend) {
      return this.memoryStore;
    }
    const getItemFunc = this.persistBackend.getItem;
    if (isFunctionLike(getItemFunc)) {
      const valueStr = await Promise.resolve(getItemFunc(this.namespace));
      if (valueStr) {
        this.memoryStore = JSON.parse(valueStr);
      }
    }
    return this.memoryStore;
  }

  public setItem(key: string, value: any) {
    this.memoryStore[key] = value;
    this.saveToPersist();
  }

  public getAllKeys() {
    return Object.keys(this.memoryStore);
  }

  public getItem(key: string): any {
    return this.memoryStore[key];
  }

  public multiGet(keys: string[]) {
    const results: any[][] = [];
    for (const key of keys) {
      results.push([key, this.memoryStore[key]]);
    }

    return results;
  }

  public multiRemove(keys: string[]) {
    for (const key of keys) {
      delete this.memoryStore[key];
    }
    this.saveToPersist();
  }

  public removeItem(key: string) {
    delete this.memoryStore[key];
    this.saveToPersist();
  }

  protected saveToPersist() {
    if (!this.persistBackend) {
      return;
    }
    if (!this.persist) {
      return;
    }
    const setItemFunc = this.persistBackend.setItem;
    if (isFunctionLike(setItemFunc)) {
      setItemFunc(this.namespace, JSON.stringify(this.memoryStore));
    }
  }
}

export default MemoryCache;
