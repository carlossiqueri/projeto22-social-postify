import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

describe('Publications test (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    await prisma.publication.deleteMany();
    await prisma.post.deleteMany();
    await prisma.media.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /health => should return 200', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(HttpStatus.OK)
      .expect("I'm okay!");
  });

  it('POST /publications => should post a new publication and return 201', async () => {
    const createMediaTest = await prisma.media.create({
      data: {
        title: 'media-title-test',
        username: 'media-username-test',
      },
    });

    const createPostTest = await prisma.post.create({
      data: {
        title: 'post-title-test',
        text: 'post-text-tet',
      },
    });

    const date = faker.date.soon();

    const testPublication = await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: createMediaTest.id,
        postId: createPostTest.id,
        date: date,
      })
      .expect(201);
  });

  it('GET /publications => should get all publications', async () => {
    const createMediaTest = await prisma.media.create({
      data: {
        title: 'media-title-test',
        username: 'media-username-test',
      },
    });

    const createPostTest = await prisma.post.create({
      data: {
        title: 'post-title-test',
        text: 'post-text-tet',
      },
    });

    const date = faker.date.soon();

    const createPublicationTest = await prisma.publication.create({
      data: {
        mediaId: createMediaTest.id,
        postId: createPostTest.id,
        date: date,
      },
    });

    const testPubli = await request(app.getHttpServer()).get('/publications');
    expect(testPubli.statusCode).toBe(200);
    expect(testPubli.body).toHaveLength(1);
  });

});
