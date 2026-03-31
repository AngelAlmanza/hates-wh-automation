import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientResponseDto } from './dto/ingredient-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('ingredients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ingredientes' })
  @ApiResponse({ status: 200, type: [IngredientResponseDto] })
  findAll() {
    return this.ingredientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ingrediente por id' })
  @ApiParam({ name: 'id', description: 'UUID del ingrediente' })
  @ApiResponse({ status: 200, type: IngredientResponseDto })
  @ApiResponse({ status: 404, description: 'Ingrediente no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un ingrediente' })
  @ApiResponse({ status: 201, type: IngredientResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El ingrediente ya existe' })
  create(@Body() dto: CreateIngredientDto) {
    return this.ingredientsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ingrediente' })
  @ApiParam({ name: 'id', description: 'UUID del ingrediente' })
  @ApiResponse({ status: 200, type: IngredientResponseDto })
  @ApiResponse({ status: 404, description: 'Ingrediente no encontrado' })
  @ApiResponse({ status: 409, description: 'El nombre ya está en uso' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un ingrediente' })
  @ApiParam({ name: 'id', description: 'UUID del ingrediente' })
  @ApiResponse({ status: 204, description: 'Ingrediente eliminado' })
  @ApiResponse({ status: 404, description: 'Ingrediente no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'El ingrediente está siendo utilizado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientsService.remove(id);
  }
}
