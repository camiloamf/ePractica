import { Module } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheHandlerModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, CacheHandlerModule],
  controllers: [MerchantController],
  providers: [MerchantService],
})
export class MerchantModule {}