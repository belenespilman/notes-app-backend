import { DatabaseError } from '@/exceptions/database.exception';
import { Category } from '@/models/entities/category.entity';
import { CategoryRepository } from '@/repositories/category.repository';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createCategoryDtoMock } from '@test/mocks/dtos/createCategory.dto.mock';
import { categoryMock } from '@test/mocks/entities/category.mock';
import { userMock } from '@test/mocks/entities/user.mock';
import { Repository } from 'typeorm';

describe('Category Repository', () => {
  const errorMessage: string = faker.string.sample();
  let categoryRepository: CategoryRepository;
  let categoryRepositoryMock: Repository<Category>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryRepository,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    categoryRepository = app.get<CategoryRepository>(CategoryRepository);
    categoryRepositoryMock = app.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  describe('createCategory', () => {
    it('Should return category created', async () => {
      jest
        .spyOn(categoryRepositoryMock, 'save')
        .mockResolvedValueOnce(categoryMock);
      const response = await categoryRepository.createCategory(
        createCategoryDtoMock,
      );
      expect(response).toEqual(categoryMock);
    });
    it('Should throw DatabaseError if save fails', async () => {
      jest
        .spyOn(categoryRepositoryMock, 'save')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(
        categoryRepository.createCategory(createCategoryDtoMock),
      ).rejects.toThrow(new DatabaseError(errorMessage));
    });
  });

  describe('getById', () => {
    it('Should return category', async () => {
      jest
        .spyOn(categoryRepositoryMock, 'findOne')
        .mockResolvedValueOnce(categoryMock);
      const response = await categoryRepository.getById(
        categoryMock.id,
        userMock,
      );
      expect(response).toEqual(categoryMock);
    });
    it('Should throw DatabaseError if findOne fails', async () => {
      jest
        .spyOn(categoryRepositoryMock, 'findOne')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(
        categoryRepository.getById(categoryMock.id, userMock),
      ).rejects.toThrow(new DatabaseError(errorMessage));
    });
  });

  describe('getByUser', () => {
    it('should retun category array', async () => {
      jest
        .spyOn(categoryRepositoryMock, 'find')
        .mockResolvedValueOnce([categoryMock]);
      const response = await categoryRepository.getByUser(userMock);
      expect(response).toEqual([categoryMock]);
    });
    it('Should throw DatabaseError if find fails', async () => {
      jest
        .spyOn(categoryRepositoryMock, 'find')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(categoryRepository.getByUser(userMock)).rejects.toThrow(
        new DatabaseError(errorMessage),
      );
    });
  });
});
