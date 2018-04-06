import LRU from 'lru-cache';
import config from 'config';

const cache = LRU({
    max: 500,
    maxAge: config.server.cacheMaxAge
});

export default cache;
