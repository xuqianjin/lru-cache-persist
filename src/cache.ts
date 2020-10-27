import MemoryCache from "./MemoryCache";

export interface ICachePolicy {
  maxEntries: number;
  persist?: boolean;
}

export interface ICacheOptions {
  policy: ICachePolicy;
  namespace: string;
  persistBackend?: any;
}

class LRUCache {
  protected memory: MemoryCache;
  protected namespace: string;
  protected policy: ICachePolicy;

  constructor(options: ICacheOptions) {
    this.namespace = options.namespace;
    this.policy = options.policy;
    this.memory = new MemoryCache(options);
  }

  public async init(): Promise<object> {
    const value = await this.memory.loadData();
    return value;
  }

  public clearAll() {
    const keys = this.memory.getAllKeys();
    this.memory.multiRemove(keys);

    return this.setLRU([]);
  }

  public enforceLimits(): any {
    if (!this.policy.maxEntries) {
      return;
    }

    const lru = this.getLRU();
    const victimCount = Math.max(0, lru.length - this.policy.maxEntries);
    const victimList = lru.slice(0, victimCount);

    for (const victimKey of victimList) {
      this.remove(victimKey);
    }

    const survivorList = lru.slice(victimCount);
    return this.setLRU(survivorList);
  }

  public getAll() {
    const keys = this.memory.getAllKeys();
    const results = this.memory.multiGet(keys);
    const allEntries: { [key: string]: any } = {};
    for (const [compositeKey, value] of results) {
      if (compositeKey === "lru") {
        continue;
      }
      allEntries[compositeKey] = value;
    }

    return allEntries;
  }

  public get(key: string): any {
    const value = this.peek(key);

    if (!value) {
      return;
    }

    this.refreshLRU(key);

    return value;
  }

  public peek(key: string): any {
    const compositeKey = this.makeCompositeKey(key);
    const entry = this.memory.getItem(compositeKey);

    let value: any;
    if (entry) {
      value = entry.value;
    }

    return value;
  }

  public remove(key: string): any {
    const compositeKey = this.makeCompositeKey(key);
    this.memory.removeItem(compositeKey);

    return this.removeFromLRU(key);
  }

  public set(key: string, value: string): any {
    const entry = {
      created: new Date(),
      value,
    };

    const compositeKey = this.makeCompositeKey(key);

    this.memory.setItem(compositeKey, entry);
    this.refreshLRU(key);
    return this.enforceLimits();
  }

  protected async addToLRU(key: string) {
    const lru = this.getLRU();

    lru.push(key);

    return this.setLRU(lru);
  }

  protected getLRU() {
    const lruArray = this.memory.getItem(this.getLRUKey());
    let lru: string[];

    if (!lruArray) {
      lru = [];
    } else {
      lru = lruArray;
    }

    return lru;
  }

  protected getLRUKey() {
    return this.makeCompositeKey("lru");
  }

  protected makeCompositeKey(key: string) {
    return `${key}`;
  }

  protected refreshLRU(key: string) {
    this.removeFromLRU(key);
    return this.addToLRU(key);
  }

  protected removeFromLRU(key: string) {
    const lru = this.getLRU();

    const newLRU = lru.filter((item: string) => {
      return item !== key;
    });

    return this.setLRU(newLRU);
  }

  protected setLRU(lru: string[]) {
    return this.memory.setItem(this.getLRUKey(), lru);
  }
}

export default LRUCache;
