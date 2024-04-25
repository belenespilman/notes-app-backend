import { Injectable } from '@nestjs/common';
import { UnauthorizedError } from '@/exceptions/unauthorized.exception';
import { EntityCreatedResponse } from '@/models/classes/entityCreatedResponse.class';
import { CreateCategoryDto } from '@/models/dtos/createCategory.dto';
import { Category } from '@/models/entities/category.entity';
import { CategoryRepository } from '@/repositories/category.repository';
import { UserRepository } from '@/repositories/user.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createCategory(
    dto: CreateCategoryDto,
    userId: string,
  ): Promise<EntityCreatedResponse> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new UnauthorizedError('Invalid token');
    }

    const { id } = await this.categoryRepository.createCategory({
      ...dto,
      user,
    });

    return { id };
  }

  async getCategoriesForUser(userId: string): Promise<Category[]> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new UnauthorizedError('Invalid token.');
    }

    const categories = await this.categoryRepository.getByUser(user);

    return categories;
  }
}
