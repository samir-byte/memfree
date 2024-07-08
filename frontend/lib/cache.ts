import { createHash } from 'node:crypto';
import { CachedResult } from './types';
import { CACHE_KEY, redisDB } from './db';

function generateHash(key: string): string {
    return createHash('sha256').update(key, 'utf8').digest('hex');
}

export async function setCache(key: string, value: CachedResult) {
    const hashKey = CACHE_KEY + generateHash(key);
    await redisDB.set(hashKey, JSON.stringify(value), { ex: 3600 * 7 });
}

export async function getCache(key: string): Promise<CachedResult | null> {
    const hashKey = CACHE_KEY + generateHash(key);
    const cache = (await redisDB.get(hashKey)) as CachedResult;
    return cache;
}
