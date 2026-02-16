import { Module, Global } from '@nestjs/common';
import { CacheService } from './cache.service';

// Global Cache Module //
@Global()
@Module({
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule { }
