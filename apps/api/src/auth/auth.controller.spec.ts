import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  login: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
  getProfile: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call authService.login with credentials', async () => {
      const loginResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        user: { id: '1', username: 'pariente', displayName: 'Pariente' },
      };
      mockAuthService.login.mockResolvedValue(loginResponse);

      const result = await controller.login({
        username: 'pariente',
        password: '$Demo1234',
      });

      expect(result).toEqual(loginResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        'pariente',
        '$Demo1234',
      );
    });
  });

  describe('refresh', () => {
    it('should call authService.refresh with token', async () => {
      const refreshResponse = {
        accessToken: 'new-token',
        refreshToken: 'new-refresh',
      };
      mockAuthService.refresh.mockResolvedValue(refreshResponse);

      const result = await controller.refresh({
        refreshToken: 'old-refresh',
      });

      expect(result).toEqual(refreshResponse);
      expect(mockAuthService.refresh).toHaveBeenCalledWith('old-refresh');
    });
  });

  describe('logout', () => {
    it('should call authService.logout and return message', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await controller.logout({
        refreshToken: 'some-token',
      });

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.logout).toHaveBeenCalledWith('some-token');
    });
  });

  describe('getProfile', () => {
    it('should call authService.getProfile with user id', async () => {
      const profile = {
        id: '1',
        username: 'pariente',
        displayName: 'Pariente',
      };
      mockAuthService.getProfile.mockResolvedValue(profile);

      const result = await controller.getProfile({ id: '1' });

      expect(result).toEqual(profile);
      expect(mockAuthService.getProfile).toHaveBeenCalledWith('1');
    });
  });
});
