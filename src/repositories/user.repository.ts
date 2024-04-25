import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseError } from '@/exceptions/database.exception';
import { User } from '@/models/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: Partial<User>): Promise<User> {
    try {
      const user = await this.userRepository.save(data);
      return user;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          username,
        },
      });

      return user;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return user;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async getProfile(id: string): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .leftJoinAndSelect('user.notes', 'notes')
        .leftJoinAndSelect('notes.categoryNotes', 'categoryNote')
        .leftJoinAndSelect('categoryNote.category', 'category')
        .leftJoinAndSelect('user.categories', 'categories')
        .getOne();

      return user;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }
}
