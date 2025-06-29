import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!redis) {
    try {
      const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
      redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      redis.on("error", (error) => {
        console.warn("Redis connection error:", error.message);
      });

      redis.on("connect", () => {
        console.log("Redis connected successfully");
      });
    } catch (error) {
      console.warn("Failed to initialize Redis:", error);
      return null;
    }
  }

  return redis;
}

export async function setCache(key: string, value: unknown, ttlSeconds = 300): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn("Redis set error:", error);
    return false;
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn("Redis get error:", error);
    return null;
  }
}

export async function deleteCache(key: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.warn("Redis delete error:", error);
    return false;
  }
}
