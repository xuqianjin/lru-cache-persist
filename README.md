# lru-cache-persist

LRU cache 持久化

## Installation

- Run the following command.

```shell
npm install --save lru-cache-persist
```

- Import the library.

```javascript
import Cache from "lru-cache-persist";
```

## Usage

You initialize a cache using the following.

```javascript
const cache = new Cache({
  namespace: "myapp",
  policy: {
    maxEntries: 50000,
    persist: false,
  },
});
```

Multiple caches can be mantained in an application by instantiating caches with different namespaces.

### Setting a key's value in the cache

```javascript
cache.set("hello", "world");
// key 'hello' is now set to 'world' in namespace 'myapp'
```

### Get an item in the cache

```javascript
const value = cache.get("key1");
console.log(value);
// 'hello'
});
```

For more usage examples, see the tests.
