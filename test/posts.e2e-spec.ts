import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Posts test (e2e)', () => {
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

  it('POST /posts => should post a new post and return 201', async () => {
    return request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'test-title',
        text: 'test-text',
      })
      .expect(201);
  });

  it('POST /posts => should return 400 if required fiels are missing', async () => {
    return request(app.getHttpServer())
      .post('/posts')
      .send({
        text: 'test-text',
      })
      .expect(400);
  });

  it('GET /posts => should return all posts', async () => {
    await prisma.post.create({
      data: {
        title: 'test-title',
        text: 'test-text',
      },
    });

    const test = await request(app.getHttpServer()).get('/posts');
    expect(test.statusCode).toBe(200);
    expect(test.body).toHaveLength(1);
  });

  it('GET /posts => should return and empty array ([]) if there is no posts', async () => {
    const test = await request(app.getHttpServer()).get('/posts');
    expect(test.statusCode).toBe(200);
    expect(test.body).toHaveLength(0);
  });

  it('GET /posts/:id => should return the correct post for the given id', async () => {
    const testPost = await prisma.post.create({
      data: {
        title: 'test-title',
        text: 'test-text',
      },
    });

    const test = await request(app.getHttpServer()).get(
      `/posts/${testPost.id}`,
    );
    expect(test.statusCode).toBe(200);
    expect(test.body).toEqual({
      id: expect.any(Number),
      image: null,
      title: 'test-title',
      text: 'test-text',
    });
  });

  it('PUT /posts/:id => should update the correct media for the given id', async () => {
    const createTestPost = await prisma.post.create({
      data: {
        title: 'test-title',
        text: 'test-text',
      },
    });

    const test = await request(app.getHttpServer())
      .put(`/posts/${createTestPost.id}`)
      .send({
        title: 'updated-test-title',
        text: 'updated-test-text',
      })
      .expect(200);
  });

  it('DELETE /posts/:id => should delete the correct media for the given id', async () => {
    const createTestPost = await prisma.post.create({
      data: {
        title: 'test-title',
        text: 'test-text',
      },
    });

    const test = await request(app.getHttpServer())
      .delete(`/posts/${createTestPost.id}`)
      .expect(200);

    // testing if it did indeed deleted the given media

    const testPost = await prisma.post.findMany();
    expect(testPost).toHaveLength(0);
  });
});
