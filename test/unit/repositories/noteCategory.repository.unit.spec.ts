import { DatabaseError } from '@/exceptions/database.exception';
import { CategoryNote } from '@/models/entities/categoryNote.entity';
import { CategoryNoteRepository } from '@/repositories/noteCategory.repository';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryMock } from '@test/mocks/entities/category.mock';
import { noteMock } from '@test/mocks/entities/note.mock';
import { userMock } from '@test/mocks/entities/user.mock';
import { Repository } from 'typeorm';

describe('CategoryNote Repository', () => {
  const errorMessage = faker.string.sample();
  let categoryNoteRepository: CategoryNoteRepository;
  let categoryNoteRepositoryMock: Repository<CategoryNote>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryNoteRepository,
        {
          provide: getRepositoryToken(CategoryNote),
          useClass: Repository,
        },
      ],
    }).compile();

    categoryNoteRepository = app.get<CategoryNoteRepository>(
      CategoryNoteRepository,
    );
    categoryNoteRepositoryMock = app.get<Repository<CategoryNote>>(
      getRepositoryToken(CategoryNote),
    );
  });

  describe('addCategoriesToNote', () => {
    it('Shoulld call save function', async () => {
      const saveFn = jest
        .spyOn(categoryNoteRepositoryMock, 'save')
        .mockResolvedValueOnce({} as never);
      await categoryNoteRepository.addCategoriesToNote(
        [categoryMock],
        noteMock,
      );
      expect(saveFn).toHaveBeenCalled();
    });
  });

  describe('removeCategoryFromNote', () => {
    it('Should call delete function', async () => {
      const deleteFn = jest
        .spyOn(categoryNoteRepositoryMock, 'delete')
        .mockResolvedValueOnce({} as never);
      await categoryNoteRepository.removeCategoryFromNote(
        categoryMock,
        noteMock,
      );
      expect(deleteFn).toHaveBeenCalled();
    });
    it('Should throw DatabaseError if delete fails', async () => {
      jest
        .spyOn(categoryNoteRepositoryMock, 'delete')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(
        categoryNoteRepository.removeCategoryFromNote(categoryMock, noteMock),
      ).rejects.toThrow(new DatabaseError(errorMessage));
    });
  });

  describe('getNotesByCategory', () => {
    it('Should return array of notes', async () => {
      jest
        .spyOn(categoryNoteRepositoryMock, 'createQueryBuilder')
        .mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          getMany: jest
            .fn()
            .mockResolvedValueOnce([{ note: { ...noteMock, user: userMock } }]),
        } as never);
      const response = await categoryNoteRepository.getNotesByCategory(
        categoryMock,
        userMock,
      );
      expect(response).toEqual([noteMock]);
    });
    it('Should throw DatabaseError if query fails', async () => {
      jest
        .spyOn(categoryNoteRepositoryMock, 'createQueryBuilder')
        .mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
        } as never);
      await expect(
        categoryNoteRepository.getNotesByCategory(categoryMock, userMock),
      ).rejects.toThrow(new DatabaseError(errorMessage));
    });
  });
});
