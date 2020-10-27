import Cache from "../src/cache";

const persistObj: any = {
  test2: JSON.stringify({ key1: "value1" }),
};
const persistBack = {
  getItem: (key: string) => {
    return persistObj[key];
  },
  setItem: (key: string, value: string) => {
    persistObj[key] = value;
  },
};
const cache = new Cache({
  namespace: "test2",
  policy: {
    maxEntries: 1,
    persist: true,
  },
  persistBackend: persistBack,
});

describe("cache", () => {
  it("can get entry", async () => {
    const value: any = await cache.init();

    expect(value["key1"]).toBe("value1");
  });

  it("can set and get entry", () => {
    cache.set("key1", "value1");
    const value = cache.get("key1");

    expect(value).toBe("value1");
  });

  it("can get a nonexistant item", () => {
    const value = cache.get("doesnotexist");

    expect(value).toBeUndefined();
  });

  it("can delete entry", () => {
    cache.set("key2", "value2");
    cache.remove("key2");

    const value = cache.get("key2");

    expect(value).toBeUndefined();
  });

  it("evicts entries in lastAccessed order", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");

    const value1 = cache.get("key1");
    expect(value1).toBeUndefined();

    const value2 = cache.get("key2");
    expect(value2).toBe("value2");
  });

  it("can peek at a item", () => {
    cache.set("key1", "value1");
    const value = cache.peek("key1");

    expect(value).toBe("value1");
  });

  it("can get all elements", () => {
    const entries = cache.getAll();

    expect(entries).not.toBeUndefined();
    expect(Object.keys(entries).length).toBe(1);

    const key1Entry = entries["key1"];
    expect(key1Entry["value"]).toBe("value1");
  });

  it("can clear all elements", () => {
    cache.clearAll();

    const entries = cache.getAll();

    expect(Object.keys(entries).length).toBe(0);
  });
});
