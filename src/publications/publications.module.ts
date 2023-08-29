import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PublicationsRepository } from './publications.repository';
import { MediasService } from '../medias/medias.service';
import { PostsService } from '../posts/posts.service';

@Module({
  imports: [MediasService, PostsService],
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository],
})
export class PublicationsModule {}
