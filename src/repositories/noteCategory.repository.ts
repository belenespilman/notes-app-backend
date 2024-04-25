import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseError } from '@/exceptions/database.exception';
import { Category } from '@/models/entities/category.entity';
import { CategoryNote } from '@/models/entities/categoryNote.entity';
import { Note } from '@/models/entities/note.entity';
import { User } from '@/models/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryNoteRepository {
  constructor(
    @InjectRepository(CategoryNote)
    private readonly categoryNoteRepository: Repository<CategoryNote>,
  ) {}

  async addCategoriesToNote(categories: Category[], note: Note): Promise<void> {
    try {
      categories.forEach((category) => {
        if (category) {
          this.categoryNoteRepository.save({ category, note });
        }
      });
      return;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async removeCategoryFromNote(category: Category, note: Note): Promise<void> {
    try {
      await this.categoryNoteRepository.delete({ category, note });
      return;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async addCategoryToNote(category: Category, note: Note): Promise<void> {
    try {
      await this.categoryNoteRepository.save({ category, note });
      return;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async getNotesByCategory(category: Category, user: User): Promise<Note[]> {
    try {
      const relations = await this.categoryNoteRepository
        .createQueryBuilder('relation')
        .where('relation.category.id = :id', { id: category.id })
        .leftJoinAndSelect('relation.note', 'note')
        .leftJoinAndSelect('note.user', 'user')
        .getMany();

      const userRelations = relations.filter(
        (relation) => relation.note.user.id === user.id,
      );
      const notes = userRelations.map((relation) => relation.note);

      return notes;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async deleteByNote(noteId: string): Promise<void> {
    try {
      await this.categoryNoteRepository
        .createQueryBuilder()
        .delete()
        .where('noteId = :noteId', { noteId })
        .execute();
    } catch ({ message }) {
      new DatabaseError(message);
    }
  }
}
