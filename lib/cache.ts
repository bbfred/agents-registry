/**
 * Simple in-memory cache with TTL support
 * For production, consider using Redis or similar
 */

interface CacheItem<T> {
  data: T
  expiry: number
}

class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map()
  
  set<T>(key: string, data: T, ttlSeconds: number): void {
    const expiry = Date.now() + (ttlSeconds * 1000)
    this.cache.set(key, { data, expiry })
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return item.data as T
  }
  
  delete(key: string): void {
    this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
      }
    }
  }
}

// Singleton instance
export const cache = new MemoryCache()

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    cache.cleanup()
  }, 5 * 60 * 1000)
}