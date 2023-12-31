import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Medias test (e2e)', () => {
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

  it('POST /medias => should post a new media and return 201', async () => {
    return request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'test-title',
        username: 'test-username',
      })
      .expect(201);
  });

  it('POST /medias => should return 400 if required fiels are missing', async () => {
    return request(app.getHttpServer())
      .post('/medias')
      .send({
        username: 'test-username',
      })
      .expect(400);
  });

  it('POST /medias => should return 409 if combination of title and username already exists', async () => {
    await prisma.media.create({
      data: {
        title: 'test-title',
        username: 'test-username',
      },
    });

    return request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'test-title',
        username: 'test-username',
      })
      .expect(409);
  });

  it('GET /medias => should return all medias', async () => {
    await prisma.media.create({
      data: {
        title: 'test-title',
        username: 'test-username',
      },
    });

    const test = await request(app.getHttpServer()).get('/medias');
    expect(test.statusCode).toBe(200);
    expect(test.body).toHaveLength(1);
  });

  it('GET /medias => should return and empty array ([]) if there is no medias', async () => {
    const test = await request(app.getHttpServer()).get('/medias');
    expect(test.statusCode).toBe(200);
    expect(test.body).toHaveLength(0);
  });

  it('GET /medias/:id => should return the correct media for the given id', async () => {
    const testMedia = await prisma.media.create({
      data: {
        title: 'test-title',
        username: 'test-username',
      },
    });

    const test = await request(app.getHttpServer()).get(
      `/medias/${testMedia.id}`,
    );
    expect(test.statusCode).toBe(200);
    expect(test.body).toEqual({
      id: expect.any(Number),
      title: 'test-title',
      username: 'test-username',
    });
  });

  it('PUT /medias/:id => should update the correct media for the given id', async () => {
    const createTestMedia = await prisma.media.create({
      data: {
        title: 'test-title',
        username: 'test-username',
      },
    });

    const test = await request(app.getHttpServer())
      .put(`/medias/${createTestMedia.id}`)
      .send({
        title: 'update-test-title',
        username: 'update-test-title',
      })
      .expect(200);
  });

  it('DELETE /media/:id => should delete the correct media for the given id', async () => {
    const createTestMedia = await prisma.media.create({
      data: {
        title: 'test-title',
        username: 'test-username',
      },
    });

    const test = await request(app.getHttpServer())
      .delete(`/medias/${createTestMedia.id}`)
      .expect(200);

    // testing if it did indeed deleted the given media

    const testMedia = await prisma.media.findMany();
    expect(testMedia).toHaveLength(0);
  });
});
