import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { PrismaService } from '../prisma/prisma.service';

const mockIngredient = {
  id: 'ing-1',
  name: 'Cebolla',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  ingredient: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('IngredientsService', () => {
  let service: IngredientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<IngredientsService>(IngredientsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all ingredients ordered by name', async () => {
      mockPrismaService.ingredient.findMany.mockResolvedValue([mockIngredient]);

      const result = await service.findAll();

      expect(result).toEqual([mockIngredient]);
      expect(mockPrismaService.ingredient.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an ingredient by id', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(mockIngredient);

      const result = await service.findOne('ing-1');

      expect(result).toEqual(mockIngredient);
    });

    it('should throw NotFoundException when ingredient not found', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return an ingredient', async () => {
      mockPrismaService.ingredient.findFirst.mockResolvedValue(null);
      mockPrismaService.ingredient.create.mockResolvedValue(mockIngredient);

      const result = await service.create({ name: 'Cebolla' });

      expect(result).toEqual(mockIngredient);
      expect(mockPrismaService.ingredient.create).toHaveBeenCalledWith({
        data: { name: 'Cebolla' },
      });
    });

    it('should throw ConflictException when ingredient name already exists', async () => {
      mockPrismaService.ingredient.findFirst.mockResolvedValue(mockIngredient);

      await expect(service.create({ name: 'Cebolla' })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the ingredient', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(mockIngredient);
      mockPrismaService.ingredient.findFirst.mockResolvedValue(null);
      mockPrismaService.ingredient.update.mockResolvedValue({
        ...mockIngredient,
        name: 'Lechuga',
      });

      const result = await service.update('ing-1', { name: 'Lechuga' });

      expect(result.name).toBe('Lechuga');
    });

    it('should throw NotFoundException when ingredient not found', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', { name: 'Lechuga' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when new name is already in use', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(mockIngredient);
      mockPrismaService.ingredient.findFirst.mockResolvedValue({
        ...mockIngredient,
        id: 'ing-2',
        name: 'Lechuga',
      });

      await expect(
        service.update('ing-1', { name: 'Lechuga' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete an ingredient', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(mockIngredient);
      mockPrismaService.ingredient.delete.mockResolvedValue(mockIngredient);

      await service.remove('ing-1');

      expect(mockPrismaService.ingredient.delete).toHaveBeenCalledWith({
        where: { id: 'ing-1' },
      });
    });

    it('should throw NotFoundException when ingredient not found', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when ingredient is in use', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(mockIngredient);
      mockPrismaService.ingredient.delete.mockRejectedValue(
        new Error('Foreign key constraint violation'),
      );

      await expect(service.remove('ing-1')).rejects.toThrow(ConflictException);
    });
  });
});
