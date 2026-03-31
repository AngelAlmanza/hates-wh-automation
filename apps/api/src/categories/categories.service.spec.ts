import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';

const mockCategory = {
  id: 'cat-1',
  name: 'Hamburguesas',
  description: 'Hamburguesas artesanales',
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all categories ordered by sortOrder and name', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([mockCategory]);

      const result = await service.findAll();

      expect(result).toEqual([mockCategory]);
      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      });
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      const result = await service.findOne('cat-1');

      expect(result).toEqual(mockCategory);
      expect(mockPrismaService.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
      });
    });

    it('should throw NotFoundException when category not found', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a category', async () => {
      mockPrismaService.category.create.mockResolvedValue(mockCategory);

      const result = await service.create({
        name: 'Hamburguesas',
        description: 'Hamburguesas artesanales',
      });

      expect(result).toEqual(mockCategory);
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Hamburguesas',
          description: 'Hamburguesas artesanales',
          sortOrder: 0,
        },
      });
    });

    it('should use provided sortOrder', async () => {
      mockPrismaService.category.create.mockResolvedValue({
        ...mockCategory,
        sortOrder: 5,
      });

      await service.create({ name: 'Bebidas', sortOrder: 5 });

      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: { name: 'Bebidas', description: undefined, sortOrder: 5 },
      });
    });
  });

  describe('update', () => {
    it('should update and return the category', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.category.update.mockResolvedValue({
        ...mockCategory,
        name: 'Burgers',
      });

      const result = await service.update('cat-1', { name: 'Burgers' });

      expect(result.name).toBe('Burgers');
      expect(mockPrismaService.category.update).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
        data: { name: 'Burgers' },
      });
    });

    it('should throw NotFoundException when category not found', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', { name: 'Burgers' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.category.delete.mockResolvedValue(mockCategory);

      await service.remove('cat-1');

      expect(mockPrismaService.category.delete).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
      });
    });

    it('should throw NotFoundException when category not found', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when category has associated products', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.category.delete.mockRejectedValue(
        new Error('Foreign key constraint violation'),
      );

      await expect(service.remove('cat-1')).rejects.toThrow(ConflictException);
    });
  });
});
