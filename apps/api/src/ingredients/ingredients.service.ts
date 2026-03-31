import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.ingredient.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
    });
    if (!ingredient) {
      throw new NotFoundException(`Ingrediente con id ${id} no encontrado`);
    }
    return ingredient;
  }

  async create(dto: CreateIngredientDto) {
    const existing = await this.prisma.ingredient.findFirst({
      where: { name: { equals: dto.name, mode: 'insensitive' } },
    });
    if (existing) {
      throw new ConflictException(
        `Ya existe un ingrediente con el nombre "${dto.name}"`,
      );
    }
    return this.prisma.ingredient.create({ data: { name: dto.name } });
  }

  async update(id: string, dto: UpdateIngredientDto) {
    await this.findOne(id);
    if (dto.name) {
      const existing = await this.prisma.ingredient.findFirst({
        where: { name: { equals: dto.name, mode: 'insensitive' }, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(
          `Ya existe un ingrediente con el nombre "${dto.name}"`,
        );
      }
    }
    return this.prisma.ingredient.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.prisma.ingredient.delete({ where: { id } });
    } catch {
      throw new ConflictException(
        'No se puede eliminar un ingrediente que está siendo utilizado',
      );
    }
  }
}
