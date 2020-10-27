"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryCache_1 = __importDefault(require("./MemoryCache"));
class LRUCache {
    constructor(options) {
        this.namespace = options.namespace;
        this.policy = options.policy;
        this.memory = new MemoryCache_1.default(options);
    }
    async init() {
        const value = await this.memory.loadData();
        return value;
    }
    clearAll() {
        const keys = this.memory.getAllKeys();
        this.memory.multiRemove(keys);
        return this.setLRU([]);
    }
    enforceLimits() {
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
    getAll() {
        const keys = this.memory.getAllKeys();
        const results = this.memory.multiGet(keys);
        const allEntries = {};
        for (const [compositeKey, value] of results) {
            if (compositeKey === "lru") {
                continue;
            }
            allEntries[compositeKey] = value;
        }
        return allEntries;
    }
    get(key) {
        const value = this.peek(key);
        if (!value) {
            return;
        }
        this.refreshLRU(key);
        return value;
    }
    peek(key) {
        const compositeKey = this.makeCompositeKey(key);
        const entry = this.memory.getItem(compositeKey);
        let value;
        if (entry) {
            value = entry.value;
        }
        return value;
    }
    remove(key) {
        const compositeKey = this.makeCompositeKey(key);
        this.memory.removeItem(compositeKey);
        return this.removeFromLRU(key);
    }
    set(key, value) {
        const entry = {
            created: new Date(),
            value,
        };
        const compositeKey = this.makeCompositeKey(key);
        this.memory.setItem(compositeKey, entry);
        this.refreshLRU(key);
        return this.enforceLimits();
    }
    async addToLRU(key) {
        const lru = this.getLRU();
        lru.push(key);
        return this.setLRU(lru);
    }
    getLRU() {
        const lruArray = this.memory.getItem(this.getLRUKey());
        let lru;
        if (!lruArray) {
            lru = [];
        }
        else {
            lru = lruArray;
        }
        return lru;
    }
    getLRUKey() {
        return this.makeCompositeKey("lru");
    }
    makeCompositeKey(key) {
        return `${key}`;
    }
    refreshLRU(key) {
        this.removeFromLRU(key);
        return this.addToLRU(key);
    }
    removeFromLRU(key) {
        const lru = this.getLRU();
        const newLRU = lru.filter((item) => {
            return item !== key;
        });
        return this.setLRU(newLRU);
    }
    setLRU(lru) {
        return this.memory.setItem(this.getLRUKey(), lru);
    }
}
exports.default = LRUCache;
//# sourceMappingURL=cache.js.map