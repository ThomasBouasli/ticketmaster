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

  it('Get empty catalog', async () => {
    const response = await request(app.getHttpServer())
      .get('/')
      .query({ page: 0, page_size: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('Create an catalog item', async () => {
    const response = await request(app.getHttpServer())
      .post('/')
      .send({ name: 'Test Item', description: 'Testing' });

    expect(response.status).toBe(201);
  });

  it('Get catalog with one item', async () => {
    const post_response = await request(app.getHttpServer())
      .post('/')
      .send({ name: 'Test Item', description: 'Testing' });

    expect(post_response.status).toBe(201);

    const get_response = await request(app.getHttpServer())
      .get('/')
      .query({ page: 0, page_size: 1 })
      .expect(200);

    expect(get_response.body).toHaveLength(1);
    expect(get_response.body[0].name).toBe('Test Item');
    expect(get_response.body[0].description).toBe('Testing');
  });

  it('Change item name', async () => {
    const post_response = await request(app.getHttpServer())
      .post('/')
      .send({ name: 'Test Item', description: 'Testing' });

    expect(post_response.status).toBe(201);

    const get_response = await request(app.getHttpServer())
      .get('/')
      .query({ page: 0, page_size: 1 });

    expect(get_response.body).toHaveLength(1);

    const change_response = await request(app.getHttpServer())
      .put(`/${get_response.body[0].id}/change-name`)
      .send({ name: 'New Name' });

    expect(change_response.status).toBe(200);

    const get_response_after_change = await request(app.getHttpServer())
      .get('/')
      .query({ page: 0, page_size: 1 });

    expect(get_response_after_change.body).toHaveLength(1);
    expect(get_response_after_change.body[0].name).toBe('New Name');
  });

  it('Change item description', async () => {
    const post_response = await request(app.getHttpServer())
      .post('/')
      .send({ name: 'Test Item', description: 'Testing' });

    expect(post_response.status).toBe(201);

    const get_response = await request(app.getHttpServer())
      .get('/')
      .query({ page: 0, page_size: 1 });

    expect(get_response.body).toHaveLength(1);

    const change_response = await request(app.getHttpServer())
      .put(`/${get_response.body[0].id}/change-description`)
      .send({ description: 'New Description' });

    expect(change_response.status).toBe(200);

    const get_response_after_change = await request(app.getHttpServer())
      .get('/')
      .query({ page: 0, page_size: 1 });

    expect(get_response_after_change.body).toHaveLength(1);
    expect(get_response_after_change.body[0].description).toBe(
      'New Description',
    );
  });
});
