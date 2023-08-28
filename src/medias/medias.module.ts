import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MediasRepository } from './medias.repository';

@Module({
  controllers: [MediasController],
  providers: [MediasService, MediasRepository]
})
export class MediasModule {}
