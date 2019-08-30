'use strict';

const assert = require('assert');

const chunkyPromise = require('../');

const createArrayOfSize = (size = 5) => {
    const ret = [];

    for (let i = 0; i < size; i++) {
        ret.push(i + 1);
    }

    return ret;
};

describe('chunky-promise', () => {
    it('should handle any chunk sizes', async () => {
        for (let i = 5; i < 100; i += 5) {
            const arr = createArrayOfSize(i);
            const op = val => val * 2;

            const res = await chunkyPromise(arr, Math.floor(i / 2), op);

            assert.equal(res.length, arr.length);
        }
    });

    it('should resolve to empty array if handler function is provided', async () => {
        const arr = createArrayOfSize(10);
        const op = val => val;

        const res = await chunkyPromise(arr, 5, op, () => null);

        assert.equal(res.length, 0);
    });

    it('should call op function in chunk order', () => {
        const arraySize = 10;
        const chunkSize = 5;
        const arr = createArrayOfSize(arraySize);

        let opCalls = 0;

        const op = (val, idx) => {
            assert.ok(opCalls === idx);

            opCalls++;
        };

        return chunkyPromise(arr, chunkSize, op);
    });

    it('should call handler function in chunk order', () => {
        const arraySize = 10;
        const chunkSize = 5;
        const arr = createArrayOfSize(arraySize);

        let handlerCalls = 0;

        const handler = vals => {
            vals.forEach((val, idx) => assert.ok(val - handlerCalls * chunkSize === idx));

            handlerCalls++;
        };

        return chunkyPromise(arr, chunkSize, val => val - 1, handler);
    });

    it('should return data in proper order', async () => {
        for (let i = 5; i < 100; i += 5) {
            const arr = createArrayOfSize(i);
            const op = val => val * 2;

            const res = await chunkyPromise(arr, Math.floor(i / 2), op);

            res.forEach((val, idx) => assert.ok(val === (idx + 1) * 2));
        }
    });

    it('should handle well when chunk size is <= 0', async () => {
        for (let i = -100; i <= 0; i += 5) {
            const arrSize = i + 200;
            const arr = createArrayOfSize(arrSize);
            const op = val => val;

            let handlerCalls = 0;

            await chunkyPromise(arr, i, op, vals => {
                assert.ok(vals.length === arrSize);
                handlerCalls++;
            });

            assert.ok(handlerCalls === 1);
        }
    });
});
