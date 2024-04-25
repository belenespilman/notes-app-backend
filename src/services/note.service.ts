import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/exceptions/notFound.exception';
import { UnauthorizedError } from '@/exceptions/unauthorized.exception';
import { EntityCreatedResponse } from '@/models/classes/entityCreatedResponse.class';
import { SuccessOperationResponse } from '@/models/classes/successOperationResponse.class';
import { CreateNoteDto } from '@/models/dtos/createNote.dto';
import { UpdateNoteDto } from '@/models/dtos/updateNote.dto';
import { Note } from '@/models/entities/note.entity';
import { CategoryRepository } from '@/repositories/category.repository';
import { NoteRepository } from '@/repositories/note.repository';
import { CategoryNoteRepository } from '@/repositories/noteCategory.repository';
import { UserRepository } from '@/repositories/user.repository';

@Injectable()
export class NoteService {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly categoryNoteRepository: CategoryNoteRepository,
  ) {}

  async createNote(
    dto: CreateNoteDto,
    userId: string,
  ): Promise<EntityCreatedResponse> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new UnauthorizedError('Invalid token.');
    }

    const note = await this.noteRepository.createNote({
      title: dto.title,
      user,
    });

    if (dto.categories) {
      const categoryPromises = dto.categories.map((categoryId) => {
        return this.categoryRepository.getById(categoryId, user);
      });
      const categories = await Promise.all(categoryPromises);
      this.categoryNoteRepository.addCategoriesToNote(categories, note);
    }

    return { id: note.id };
  }

  async modifyNoteCategory(
    noteId: string,
    categoryId: string,
    userId: string,
    operation: 'ADD' | 'REMOVE',
  ): Promise<SuccessOperationResponse> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new UnauthorizedError('Invalid token');
    }

    const note = await this.noteRepository.getById(noteId, user);

    if (!note) {
      throw new NotFoundError('Note not found for the given ID.');
    }

    const category = await this.categoryRepository.getById(categoryId, user);

    if (!category) {
      throw new NotFoundError('Category not found for the given ID.');
    }

    if (operation === 'ADD') {
      await this.categoryNoteRepository.addCategoryToNote(category, note);
    } else {
      await this.categoryNoteRepository.removeCategoryFromNote(category, note);
    }

    return { message: 'OK' };
  }

  async updateNote(
    noteId: string,
    userId: string,
    update: UpdateNoteDto,
  ): Promise<SuccessOperationResponse> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new UnauthorizedError('Invalid token');
    }

    await this.noteRepository.updateNote(noteId, user, update);

    return { message: 'OK' };
  }

  async deleteNote(
    noteId: string,
    userId: string,
  ): Promise<SuccessOperationResponse> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new UnauthorizedError('Invalid token');
    }

    await this.categoryNoteRepository.deleteByNote(noteId);

    await this.noteRepository.deleteNote(noteId, user);

    return { message: 'OK' };
  }

  async getNotesByCategoryId(
    userId: string,
    categoryId: string,
  ): Promise<Note[]> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new UnauthorizedError('Invalid token');
    }

    const category = await this.categoryRepository.getById(categoryId, user);

    if (!category) {
      throw new NotFoundError('No category was found for the given ID.');
    }

    const notes = await this.categoryNoteRepository.getNotesByCategory(
      category,
      user,
    );

    return notes;
  }
}
