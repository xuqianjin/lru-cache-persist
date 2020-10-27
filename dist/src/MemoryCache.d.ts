export interface ICachePolicy {
    maxEntries: number;
    persist?: boolean;
}
export interface ICacheOptions {
    policy: ICachePolicy;
    namespace: string;
    persistBackend?: any;
}
declare class MemoryCache {
    protected memoryStore: any;
    protected namespace: string;
    protected persistBackend: any;
    protected persist: boolean;
    constructor(options: ICacheOptions);
    loadData(): Promise<any>;
    setItem(key: string, value: any): void;
    getAllKeys(): string[];
    getItem(key: string): any;
    multiGet(keys: string[]): any[][];
    multiRemove(keys: string[]): void;
    removeItem(key: string): void;
    protected saveToPersist(): void;
}
export default MemoryCache;
