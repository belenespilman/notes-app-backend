import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseError } from '@/exceptions/database.exception';
import { Category } from '@/models/entities/category.entity';
import { User } from '@/models/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(data: Partial<Category>) {
    try {
      const category = await this.categoryRepository.save(data);
      return category;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async getById(id: string, user: User): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id, user },
      });
      return category;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async getByUser(user: User): Promise<Category[]> {
    try {
      const categories = await this.categoryRepository.find({
        where: { user },
      });
      return categories;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }
}
