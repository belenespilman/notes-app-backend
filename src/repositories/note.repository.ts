import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseError } from '@/exceptions/database.exception';
import { Note } from '@/models/entities/note.entity';
import { User } from '@/models/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NoteRepository {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async createNote(data: Partial<Note>): Promise<Note> {
    try {
      const note = await this.noteRepository.save(data);
      return note;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async getById(id: string, user: User): Promise<Note> {
    try {
      const note = await this.noteRepository.findOne({ where: { id, user } });
      return note;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async updateNote(
    id: string,
    user: User,
    payload: Partial<Note>,
  ): Promise<void> {
    try {
      await this.noteRepository.save({
        id,
        user,
        ...payload,
      });
      return;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }

  async deleteNote(id: string, user: User): Promise<void> {
    try {
      await this.noteRepository.delete({ id, user });
      return;
    } catch ({ message }) {
      throw new DatabaseError(message);
    }
  }
}
