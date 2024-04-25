import { NoteController } from '@/controllers/note.controller';
import { SuccessOperationResponse } from '@/models/classes/successOperationResponse.class';
import { CategoryRepository } from '@/repositories/category.repository';
import { NoteRepository } from '@/repositories/note.repository';
import { CategoryNoteRepository } from '@/repositories/noteCategory.repository';
import { UserRepository } from '@/repositories/user.repository';
import { NoteService } from '@/services/note.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { createNoteDtoMock } from '@test/mocks/dtos/createNote.dto.mock';
import { updateNoteDtoMock } from '@test/mocks/dtos/updateNote.dto.mock';
import { categoryMock } from '@test/mocks/entities/category.mock';
import { noteMock } from '@test/mocks/entities/note.mock';
import { categoryRepositoryMock } from '@test/mocks/repositories/category.repository.mock';
import { categoryNoteRepositoryMock } from '@test/mocks/repositories/categoryNote.repository.mock';
import { noteRepositoryMock } from '@test/mocks/repositories/note.repository.mock';
import { userRepositoryMock } from '@test/mocks/repositories/user.repository.mock';
import { requestMock } from '@test/mocks/request.mock';

describe('Note Controller', () => {
  let noteController: NoteController;
  let noteService: NoteService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
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

    noteController = app.get<NoteController>(NoteController);
    noteService = app.get<NoteService>(NoteService);
  });

  describe('createNote', () => {
    it('Should return created note', async () => {
      jest.spyOn(noteService, 'createNote').mockResolvedValueOnce(noteMock);
      const response = await noteController.createNote(
        requestMock,
        createNoteDtoMock,
      );
      expect(response).toEqual(noteMock);
    });
  });

  describe('addCategoryToNote', () => {
    it('Should return success message', async () => {
      const serviceResponse: SuccessOperationResponse = {
        message: 'OK',
      };
      jest
        .spyOn(noteService, 'modifyNoteCategory')
        .mockResolvedValueOnce(serviceResponse);
      const response = await noteController.addCategoryToNote(
        noteMock.id,
        categoryMock.id,
        requestMock,
      );
      expect(response).toEqual(serviceResponse);
    });
  });

  describe('removeCategoryFromNote', () => {
    it('Should return success message', async () => {
      const serviceResponse: SuccessOperationResponse = {
        message: 'OK',
      };
      jest
        .spyOn(noteService, 'modifyNoteCategory')
        .mockResolvedValueOnce(serviceResponse);
      const response = await noteController.removeCategoryFromNote(
        noteMock.id,
        categoryMock.id,
        requestMock,
      );
      expect(response).toEqual(serviceResponse);
    });
  });

  describe('updateNote', () => {
    it('Should return success message', async () => {
      const serviceResponse: SuccessOperationResponse = {
        message: 'OK',
      };
      jest
        .spyOn(noteService, 'updateNote')
        .mockResolvedValueOnce(serviceResponse);
      const response = await noteController.updateNote(
        noteMock.id,
        updateNoteDtoMock,
        requestMock,
      );
      expect(response).toEqual(serviceResponse);
    });
  });

  describe('deleteNote', () => {
    it('Should return success message', async () => {
      const serviceResponse: SuccessOperationResponse = {
        message: 'OK',
      };
      jest
        .spyOn(noteService, 'deleteNote')
        .mockResolvedValueOnce(serviceResponse);
      const response = await noteController.deleteNote(
        noteMock.id,
        requestMock,
      );
      expect(response).toEqual(serviceResponse);
    });
  });

  describe('getNotesByCategoryId', () => {
    it('Should return array of notes', async () => {
      jest
        .spyOn(noteService, 'getNotesByCategoryId')
        .mockResolvedValueOnce([noteMock]);
      const response = await noteController.getNotesByCategoryId(
        categoryMock.id,
        requestMock,
      );
      expect(response).toEqual([noteMock]);
    });
  });
});
