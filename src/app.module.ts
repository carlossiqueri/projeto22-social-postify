import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { PostsController } from './posts/posts.controller';
import { MediasModule } from './medias/medias.module';
import { PublicationModule } from './publication/publication.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PostsModule, MediasModule, PublicationModule, PrismaModule],
  controllers: [AppController, PostsController],
  providers: [AppService],
})

export class AppModule {}
