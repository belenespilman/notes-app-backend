import { NotFoundError } from '@/exceptions/notFound.exception';
import { UnauthorizedError } from '@/exceptions/unauthorized.exception';
import { CategoryRepository } from '@/repositories/category.repository';
import { NoteRepository } from '@/repositories/note.repository';
import { CategoryNoteRepository } from '@/repositories/noteCategory.repository';
import { UserRepository } from '@/repositories/user.repository';
import { NoteService } from '@/services/note.service';
import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { createNoteDtoMock } from '@test/mocks/dtos/createNote.dto.mock';
import { updateNoteDtoMock } from '@test/mocks/dtos/updateNote.dto.mock';
import { categoryMock } from '@test/mocks/entities/category.mock';
import { noteMock } from '@test/mocks/entities/note.mock';
import { userMock } from '@test/mocks/entities/user.mock';
import { categoryRepositoryMock } from '@test/mocks/repositories/category.repository.mock';
import { categoryNoteRepositoryMock } from '@test/mocks/repositories/categoryNote.repository.mock';
import { noteRepositoryMock } from '@test/mocks/repositories/note.repository.mock';
import { userRepositoryMock } from '@test/mocks/repositories/user.repository.mock';

describe('Note Service', () => {
  let noteService: NoteService;
  let noteRepository: NoteRepository;
  let userRepository: UserRepository;
  let categoryRepository: CategoryRepository;
  let categoryNoteRepository: CategoryNoteRepository;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        JwtService,
        {
          provide: NoteRepository,
          useFactory: noteRepositoryMock,
        },
        {
          provide: UserRepository,
          useFactory: userRepositoryMock,
        },
        {
          provide: CategoryRepository,
          useFactory: categoryRepositoryMock,
        },
        {
          provide: CategoryNoteRepository,
          useFactory: categoryNoteRepositoryMock,
        },
      ],
    }).compile();

    noteRepository = app.get<NoteRepository>(NoteRepository);
    noteService = app.get<NoteService>(NoteService);
    userRepository = app.get<UserRepository>(UserRepository);
    categoryRepository = app.get<CategoryRepository>(CategoryRepository);
    categoryNoteRepository = app.get<CategoryNoteRepository>(
      CategoryNoteRepository,
    );
  });

  describe('createNote', () => {
    it('Should return ID of the created note with categories', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(userMock);
      jest.spyOn(noteRepository, 'createNote').mockResolvedValueOnce(noteMock);
      jest
        .spyOn(categoryRepository, 'getById')
        .mockResolvedValueOnce(categoryMock);
      jest
        .spyOn(categoryNoteRepository, 'addCategoriesToNote')
        .mockResolvedValueOnce();
      const response = await noteService.createNote(
        createNoteDtoMock,
        userMock.id,
      );
      expect(response).toEqual({ id: noteMock.id });
    });
    it('Should throw unauthorized error if user is not found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(null);
      await expect(
        noteService.createNote(createNoteDtoMock, userMock.id),
      ).rejects.toThrow(new UnauthorizedError('Invalid token.'));
    });
  });

  describe('modifyNoteCateegory', () => {
    it('Should return success response when adding category', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(userMock);
      jest.spyOn(noteRepository, 'getById').mockResolvedValueOnce(noteMock);
      jest
        .spyOn(categoryRepository, 'getById')
        .mockResolvedValueOnce(categoryMock);
      jest
        .spyOn(categoryNoteRepository, 'addCategoryToNote')
        .mockResolvedValueOnce();
      const response = await noteService.modifyNoteCategory(
        noteMock.id,
        categoryMock.id,
        userMock.id,
        'ADD',
      );
      expect(response).toEqual({ message: 'OK' });
    });
    it('Should return success response when removing category', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(userMock);
      jest.spyOn(noteRepository, 'getById').mockResolvedValueOnce(noteMock);
      jest
        .spyOn(categoryRepository, 'getById')
        .mockResolvedValueOnce(categoryMock);
      jest
        .spyOn(categoryNoteRepository, 'removeCategoryFromNote')
        .mockResolvedValueOnce();
      const response = await noteService.modifyNoteCategory(
        noteMock.id,
        categoryMock.id,
        userMock.id,
        'REMOVE',
      );
      expect(response).toEqual({ message: 'OK' });
    });
    it('Should throw UnauthorizedError if user is not found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(null);
      await expect(
        noteService.modifyNoteCategory(
          noteMock.id,
          categoryMock.id,
          userMock.id,
          'REMOVE',
        ),
      ).rejects.toThrow(new UnauthorizedError('Invalid token'));
    });
    it('Should throw NotFoundError if note is not found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(userMock);
      jest.spyOn(noteRepository, 'getById').mockResolvedValueOnce(null);
      await expect(
        noteService.modifyNoteCategory(
          noteMock.id,
          categoryMock.id,
          userMock.id,
          'REMOVE',
        ),
      ).rejects.toThrow(new NotFoundError('Note not found for the given ID.'));
    });
    it('Should throw NotFoundError if category is not found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(userMock);
      jest.spyOn(noteRepository, 'getById').mockResolvedValueOnce(noteMock);
      jest.spyOn(categoryRepository, 'getById').mockResolvedValueOnce(null);
      await expect(
        noteService.modifyNoteCategory(
          noteMock.id,
          categoryMock.id,
          userMock.id,
          'REMOVE',
        ),
      ).rejects.toThrow(
        new NotFoundError('Category not found for the given ID.'),
      );
    });
  });

  describe('updateNote', () => {
    it('Should return OK successful message', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValue(userMock);
      jest.spyOn(noteRepository, 'updateNote').mockResolvedValueOnce();
      const response = await noteService.updateNote(
        noteMock.id,
        userMock.id,
        updateNoteDtoMock,
      );
      expect(response).toEqual({ message: 'OK' });
    });
    it('Should throw UnauthorizedError if user is not found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValue(null);
      await expect(
        noteService.updateNote(noteMock.id, userMock.id, updateNoteDtoMock),
      ).rejects.toThrow(new UnauthorizedError('Invalid token'));
    });
  });

  describe('deleteNote', () => {
    it('Should return OK successful message', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValue(userMock);
      jest.spyOn(noteRepository, 'deleteNote').mockResolvedValueOnce();
      const response = await noteService.deleteNote(noteMock.id, userMock.id);
      expect(response).toEqual({ message: 'OK' });
    });
    it('Should throw UnauthorizedError if user is not found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValue(null);
      await expect(
        noteService.deleteNote(noteMock.id, userMock.id),
      ).rejects.toThrow(new UnauthorizedError('Invalid token'));
    });
  });

  describe('getNotesByCategoryId', () => {
    it('Should return array of notes', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(userMock);
      jest
        .spyOn(categoryRepository, 'getById')
        .mockResolvedValueOnce(categoryMock);
      jest
        .spyOn(categoryNoteRepository, 'getNotesByCategory')
        .mockResolvedValueOnce([noteMock]);
      const response = await noteService.getNotesByCategoryId(
        userMock.id,
        categoryMock.id,
      );
      expect(response).toEqual([noteMock]);
    });
    it('Should throw UnauthorizedError if user is not found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValue(null);
      await expect(
        noteService.getNotesByCategoryId(userMock.id, categoryMock.id),
      ).rejects.toThrow(new UnauthorizedError('Invalid token'));
    });
    it('Should throw NotFoundError if category is not found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValue(userMock);
      jest.spyOn(categoryRepository, 'getById').mockResolvedValueOnce(null);
      await expect(
        noteService.getNotesByCategoryId(userMock.id, categoryMock.id),
      ).rejects.toThrow(
        new NotFoundError('No category was found for the given ID.'),
      );
    });
  });
});
