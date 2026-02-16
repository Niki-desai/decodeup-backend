import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

// Redis Cache Service //
@Injectable()
export class CacheService {
    private readonly logger = new Logger(CacheService.name);
    private readonly redis: Redis;

    constructor(private configService: ConfigService) {
        // Initialize Redis client //
        this.redis = new Redis({
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        });

        this.redis.on('connect', () => {
            this.logger.log('Redis connected successfully');
        });

        this.redis.on('error', (err) => {
            this.logger.error('Redis connection error:', err);
        });
    }

    // Get value from cache //
    async get(key: string): Promise<string | null> {
        try {
            return await this.redis.get(key);
        } catch (error) {
            this.logger.error(`Cache GET error for key ${key}:`, error);
            return null;
        }
    }

    // Set value in cache with TTL //
    async set(key: string, value: string, ttl?: number): Promise<void> {
        try {
            if (ttl) {
                await this.redis.setex(key, ttl, value);
            } else {
                await this.redis.set(key, value);
            }
        } catch (error) {
            this.logger.error(`Cache SET error for key ${key}:`, error);
        }
    }

    // Delete key from cache //
    async del(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (error) {
            this.logger.error(`Cache DEL error for key ${key}:`, error);
        }
    }

    // Clear all cache //
    async flushAll(): Promise<void> {
        try {
            await this.redis.flushall();
            this.logger.log('All cache cleared');
        } catch (error) {
            this.logger.error('Cache FLUSH error:', error);
        }
    }
}
