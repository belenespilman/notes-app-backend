import { DatabaseError } from '@/exceptions/database.exception';
import { Note } from '@/models/entities/note.entity';
import { NoteRepository } from '@/repositories/note.repository';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createNoteDtoMock } from '@test/mocks/dtos/createNote.dto.mock';
import { updateNoteDtoMock } from '@test/mocks/dtos/updateNote.dto.mock';
import { noteMock } from '@test/mocks/entities/note.mock';
import { userMock } from '@test/mocks/entities/user.mock';
import { Repository } from 'typeorm';

describe('Note Repository', () => {
  const errorMessage: string = faker.string.sample();
  let noteRepository: NoteRepository;
  let noteRepositoryMock: Repository<Note>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        NoteRepository,
        {
          provide: getRepositoryToken(Note),
          useClass: Repository,
        },
      ],
    }).compile();

    noteRepository = app.get<NoteRepository>(NoteRepository);
    noteRepositoryMock = app.get<Repository<Note>>(getRepositoryToken(Note));
  });

  describe('createNote', () => {
    it('Should return created note', async () => {
      jest.spyOn(noteRepositoryMock, 'save').mockResolvedValueOnce(noteMock);
      const response = await noteRepository.createNote(createNoteDtoMock);
      expect(response).toEqual(noteMock);
    });
    it('Should throw DatabaseError if save fails', async () => {
      jest
        .spyOn(noteRepositoryMock, 'save')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(
        noteRepository.createNote(createNoteDtoMock),
      ).rejects.toThrow(new DatabaseError(errorMessage));
    });
  });

  describe('getById', () => {
    it('Should return note', async () => {
      jest.spyOn(noteRepositoryMock, 'findOne').mockResolvedValueOnce(noteMock);
      const response = await noteRepository.getById(noteMock.id, userMock);
      expect(response).toEqual(noteMock);
    });
    it('Should throw DatabaseError if findOne fails', async () => {
      jest
        .spyOn(noteRepositoryMock, 'findOne')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(
        noteRepository.getById(noteMock.id, userMock),
      ).rejects.toThrow(new DatabaseError(errorMessage));
    });
  });

  describe('updateNote', () => {
    it('Should call save', async () => {
      const saveFn = jest
        .spyOn(noteRepositoryMock, 'save')
        .mockResolvedValueOnce(noteMock);
      await noteRepository.updateNote(noteMock.id, userMock, updateNoteDtoMock);
      expect(saveFn).toHaveBeenCalled();
    });
    it('Should throw DatabaseError if save fails', async () => {
      jest
        .spyOn(noteRepositoryMock, 'save')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(
        noteRepository.updateNote(noteMock.id, userMock, updateNoteDtoMock),
      ).rejects.toThrow(new DatabaseError(errorMessage));
    });
  });

  describe('deleteNote', () => {
    it('Should call delete ', async () => {
      const deleteFn = jest
        .spyOn(noteRepositoryMock, 'delete')
        .mockResolvedValueOnce({} as never);
      await noteRepository.deleteNote(noteMock.id, userMock);
      expect(deleteFn).toHaveBeenCalled();
    });
    it('Should throw DatabaseError if delete fails', async () => {
      jest
        .spyOn(noteRepositoryMock, 'delete')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(
        noteRepository.deleteNote(noteMock.id, userMock),
      ).rejects.toThrow(new DatabaseError(errorMessage));
    });
  });
});
