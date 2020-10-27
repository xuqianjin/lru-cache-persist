"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isFunctionLike = (obj) => obj !== null && (typeof obj === "object" || typeof obj === "function");
class MemoryCache {
    constructor(options) {
        var _a;
        this.memoryStore = {};
        this.namespace = options.namespace;
        this.persistBackend = options.persistBackend;
        this.persist = Boolean((_a = options.policy) === null || _a === void 0 ? void 0 : _a.persist);
        this.memoryStore = {};
    }
    async loadData() {
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
    setItem(key, value) {
        this.memoryStore[key] = value;
        this.saveToPersist();
    }
    getAllKeys() {
        return Object.keys(this.memoryStore);
    }
    getItem(key) {
        return this.memoryStore[key];
    }
    multiGet(keys) {
        const results = [];
        for (const key of keys) {
            results.push([key, this.memoryStore[key]]);
        }
        return results;
    }
    multiRemove(keys) {
        for (const key of keys) {
            delete this.memoryStore[key];
        }
        this.saveToPersist();
    }
    removeItem(key) {
        delete this.memoryStore[key];
        this.saveToPersist();
    }
    saveToPersist() {
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
exports.default = MemoryCache;
//# sourceMappingURL=MemoryCache.js.map