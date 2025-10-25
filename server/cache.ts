// In-memory cache implementation
// Simple TTL-based cache for API responses and frequent queries

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class InMemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 3600 * 1000; // 1 hour in milliseconds

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, value: T, ttlMs?: number): void {
    const ttl = ttlMs || this.defaultTTL;
    const expiresAt = Date.now() + ttl;

    this.cache.set(key, {
      data: value,
      expiresAt,
    });
  }

  /**
   * Get a value from cache (returns undefined if expired or not found)
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data as T;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Delete a specific key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean up expired entries (can be run periodically)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const cache = new InMemoryCache();

// Run cleanup every 10 minutes
setInterval(() => {
  cache.cleanup();
}, 10 * 60 * 1000);
