import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true, // Esto asegura que CacheModule sea accesible en todo el proyecto
    }),
  ],
  providers: [CacheService],
  exports: [CacheService], // Asegúrate de exportar el servicio
})
export class CacheHandlerModule {}