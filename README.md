# chunky-promise

`chunky-promise` offers the ability to split up operations/function calls over data into chunks. For example, this is very useful if you need to make network/api requests for each entry in a large data set. This **can** be used to synchronous operations, but do keep in mind that `chunky-promise` does return a `Promise` object.

## Installation

`yarn add @fizzygalacticus/chunky-promise` || `npm i --save @fizzygalacticus/chunky-promise`

## Usage

`chunky-promise` accepts four arguments:
1. `arr`: the array to perform your operations over
2. `chunkSize`: your desired size of chunks to break `arr` into
3. `op`: function to operate on data. Has signature `(val, idx) => any`
4. `handler`: (optional) - handle results from `op` as you go, instead of after all have completed.

**note** if you specify a `handler` method, the resulting array from `chunky-promise` will be empty

### Without handler
```js
const chunkyPromise = require('@fizzygalacticus/chunky-promise');

const myData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const res = await chunkyPromise(myData, 2, (val, idx) => ({ [val]: idx }));

console.log(res);
```

outputs:
```sh
[
    { '1': 0 },
    { '2': 1 },
    { '3': 2 },
    { '4': 3 },
    { '5': 4 },
    { '6': 5 },
    { '7': 6 },
    { '8': 7 },
    { '9': 8 },
    { '10': 9 },
]
```

### With handler

```js
const chunkyPromise = require('@fizzygalacticus/chunky-promise');

const myData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const res = await chunkyPromise(myData, 2, (val, idx) => ({ [val]: idx }), console.log);

console.log(res); // empty array
```

outputs:
```sh
[ { '1': 0 }, { '2': 1 } ]
[ { '3': 2 }, { '4': 3 } ]
[ { '5': 4 }, { '6': 5 } ]
[ { '7': 6 }, { '8': 7 } ]
[ { '9': 8 }, { '10': 9 } ]
[]
```
