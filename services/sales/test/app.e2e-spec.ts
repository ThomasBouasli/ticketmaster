import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/id').expect(200);
    expect(response.body).toEqual({});
  });

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/')
      .send({ catalog_item_id: 'id', price: 10 });

    expect(response.status).toBe(201);
  });

  it('/ (POST & GET)', async () => {
    const post_response = await request(app.getHttpServer())
      .post('/')
      .send({ catalog_item_id: 'id', price: 10 });

    expect(post_response.status).toBe(201);

    const get_response = await request(app.getHttpServer())
      .get('/id')
      .expect(200);

    expect(get_response.body.price).toBe(10);
  });

  it('/ (POST & GET)', async () => {
    const post_response = await request(app.getHttpServer())
      .post('/')
      .send({ catalog_item_id: 'id', price: 10 });

    expect(post_response.status).toBe(201);

    const post_response2 = await request(app.getHttpServer())
      .post('/id/increase')
      .send({ price: 5 });

    expect(post_response2.status).toBe(201);

    const get_response = await request(app.getHttpServer())
      .get('/id')
      .expect(200);

    expect(get_response.body.price).toBe(15);
  });

  it('/ (POST & GET)', async () => {
    const post_response = await request(app.getHttpServer())
      .post('/')
      .send({ catalog_item_id: 'id', price: 10 });

    expect(post_response.status).toBe(201);

    const post_response2 = await request(app.getHttpServer())
      .post('/id/decrease')
      .send({ price: 5 });

    expect(post_response2.status).toBe(201);

    const get_response = await request(app.getHttpServer())
      .get('/id')
      .expect(200);

    expect(get_response.body.price).toBe(5);
  });

  it('/ (POST & GET)', async () => {
    const post_response = await request(app.getHttpServer())
      .post('/')
      .send({ catalog_item_id: 'id', price: 10 });

    expect(post_response.status).toBe(201);

    const post_response2 = await request(app.getHttpServer())
      .post('/id/decrease')
      .send({ price: 5 });

    expect(post_response2.status).toBe(201);

    const get_response = await request(app.getHttpServer())
      .get('/')
      .send({ catalog_item_ids: ['id'] })
      .expect(200);

    expect(get_response.body).toHaveLength(1);
    expect(get_response.body[0].price).toBe(5);
  });
});
