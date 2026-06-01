import { redis } from "../redis/redis";

export const rateLimit = async (key: string) => {
  const limit = 5; // max 5 request
  const window = 60; // 60 sec

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, window);
  }

  if (count > limit) {
    return false;
  }

  return true;
};