import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health (GET) should return ok', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  describe('Auth flow', () => {
    let accessToken: string;
    let refreshToken: string;

    it('POST /api/auth/login with invalid credentials should return 401', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'pariente', password: 'wrong' })
        .expect(401);
    });

    it('POST /api/auth/login with missing fields should return 400', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'pariente' })
        .expect(400);
    });

    it('POST /api/auth/login with valid credentials should return tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'pariente', password: '$Demo1234' })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toEqual(
        expect.objectContaining({
          username: 'pariente',
          displayName: 'Pariente',
        }),
      );

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('GET /api/auth/profile without token should return 401', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .expect(401);
    });

    it('GET /api/auth/profile with valid token should return user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          username: 'pariente',
          displayName: 'Pariente',
        }),
      );
    });

    it('POST /api/auth/refresh with valid token should return new tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      // Old refresh token should be invalidated (rotation)
      const retryResponse = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);

      expect(retryResponse.body.message).toBeDefined();

      // Update tokens for next tests
      refreshToken = response.body.refreshToken;
    });

    it('POST /api/auth/logout should invalidate refresh token', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(200);

      // Refresh token should no longer work
      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });
  });
});
