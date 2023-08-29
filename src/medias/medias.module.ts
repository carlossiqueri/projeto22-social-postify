import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { MediasRepository } from './medias.repository';
import { PostsService } from '../posts/posts.service';

@Module({
  controllers: [MediasController],
  providers: [MediasService, MediasRepository],
  exports: [PostsService],
})
export class MediasModule {}
