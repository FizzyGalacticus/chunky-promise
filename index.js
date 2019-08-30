'use strict';

const chunk = (arr = [], size) => {
    if (!size) {
        return [arr];
    }

    const ret = [];

    for (let i = 0; i < arr.length; i += size) {
        ret.push(arr.slice(i, i + size));
    }

    return ret;
};

const chunkPromise = async (arr, size, op = value => value, handler) => {
    const ret = [];

    const chunks = chunk(arr, size);

    for (let i = 0; i < chunks.length; i++) {
        const section = chunks[i];
        const responses = await Promise.all(section.map((d, idx) => op(d, i * size + idx)));

        if (handler && typeof handler === 'function') {
            await handler(responses);
        } else {
            ret.push(...responses);
        }
    }

    return ret;
};

module.exports = chunkPromise;
