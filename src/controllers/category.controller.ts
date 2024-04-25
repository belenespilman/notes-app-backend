import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthenticateGuard } from '@/guards/authenticate.guard';
import { EntityCreatedResponse } from '@/models/classes/entityCreatedResponse.class';
import { CreateCategoryDto } from '@/models/dtos/createCategory.dto';
import { Category } from '@/models/entities/category.entity';
import { CategoryService } from '@/services/category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthenticateGuard)
  createCategory(
    @Req() request: Request,
    @Body() body: CreateCategoryDto,
  ): Promise<EntityCreatedResponse> {
    const userId = request['user'].id;
    return this.categoryService.createCategory(body, userId);
  }

  @Get()
  @UseGuards(AuthenticateGuard)
  getUserCategories(@Req() request: Request): Promise<Category[]> {
    const userId = request['user'].id;
    return this.categoryService.getCategoriesForUser(userId);
  }
}
