import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { Item, ItemStatus } from '../src/database/entities/item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let item_repo: Repository<Item>;
  let config: ConfigService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    item_repo = moduleFixture.get(getRepositoryToken(Item));
    config = moduleFixture.get(ConfigService);

    await app.init();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  afterEach(async () => {
    await app.close();
  });

  describe('create an item', () => {
    it('should create an item', async () => {
      const response = await request(app.getHttpServer())
        .post('/')
        .send({ quantity: 10, catalog_item_id: 'id' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({});

      const items_count = await item_repo.count({
        where: { catalog_item_id: 'id' },
      });

      expect(items_count).toBe(10);
    });
  });

  describe('get an item', () => {
    const dummy = { quantity: 10, catalog_item_id: 'id' };

    beforeEach(async () => {
      await request(app.getHttpServer()).post('/').send(dummy);
    });

    it('should not find any items', async () => {
      const response = await request(app.getHttpServer()).get('/unknown_id');

      expect(response.status).toBe(200);
      expect(response.body.count).toEqual(0);
    });

    it('should get the item count', async () => {
      const response = await request(app.getHttpServer()).get('/id');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(10);
    });
  });

  describe('decrease an item', () => {
    const dummy = { quantity: 10, catalog_item_id: 'id' };

    beforeEach(async () => {
      await request(app.getHttpServer()).post('/').send(dummy);
    });

    it('should decrease the item count', async () => {
      const post_response = await request(app.getHttpServer())
        .post('/id/decrease')
        .send({ quantity: 5 });

      expect(post_response.status).toBe(201);

      const found = await item_repo.count({
        where: { catalog_item_id: 'id' },
      });

      expect(found).toBe(5);
    });
  });

  describe('increase an item', () => {
    const dummy = { quantity: 10, catalog_item_id: 'id' };

    beforeEach(async () => {
      await request(app.getHttpServer()).post('/').send(dummy);
    });

    it('should increase the item count', async () => {
      const post_response = await request(app.getHttpServer())
        .post('/id/increase')
        .send({ quantity: 10 });

      expect(post_response.status).toBe(201);

      const found = await item_repo.count({
        where: { catalog_item_id: 'id' },
      });

      expect(found).toBe(20);
    });
  });

  describe('reserve an item', () => {
    const dummy = { quantity: 1, catalog_item_id: 'id' };

    beforeEach(async () => {
      await request(app.getHttpServer()).post('/').send(dummy);
    });

    it('should reserve an item', async () => {
      const post_response = await request(app.getHttpServer()).post(
        '/id/reserve',
      );

      expect(post_response.status).toBe(201);

      const count = await item_repo.count({
        where: { catalog_item_id: 'id', status: ItemStatus.RESERVED },
      });

      expect(count).toBe(1);
    });
  });

  describe('unreserve an item', () => {
    const dummy = { quantity: 1, catalog_item_id: 'id' };

    beforeEach(async () => {
      await request(app.getHttpServer()).post('/').send(dummy);
    });

    it('should unreserve an item', async () => {
      await request(app.getHttpServer()).post('/id/reserve');

      const timeout = Number(config.get('RESERVATION_TIMEOUT'));

      await new Promise((resolve) =>
        setTimeout(resolve, timeout * 1.5 * 1_000),
      );

      const count = await item_repo.count({
        where: { catalog_item_id: 'id', status: ItemStatus.RESERVED },
      });

      expect(count).toBe(0);
    }, 10_000);
  });
});
