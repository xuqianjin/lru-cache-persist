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
declare class LRUCache {
    protected memory: MemoryCache;
    protected namespace: string;
    protected policy: ICachePolicy;
    constructor(options: ICacheOptions);
    init(): Promise<object>;
    clearAll(): void;
    enforceLimits(): any;
    getAll(): {
        [key: string]: any;
    };
    get(key: string): any;
    peek(key: string): any;
    remove(key: string): any;
    set(key: string, value: string): any;
    protected addToLRU(key: string): Promise<void>;
    protected getLRU(): string[];
    protected getLRUKey(): string;
    protected makeCompositeKey(key: string): string;
    protected refreshLRU(key: string): Promise<void>;
    protected removeFromLRU(key: string): void;
    protected setLRU(lru: string[]): void;
}
export default LRUCache;
