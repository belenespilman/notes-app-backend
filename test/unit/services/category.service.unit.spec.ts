import { CategoryController } from '@/controllers/category.controller';
import { UnauthorizedError } from '@/exceptions/unauthorized.exception';
import { CategoryRepository } from '@/repositories/category.repository';
import { UserRepository } from '@/repositories/user.repository';
import { CategoryService } from '@/services/category.service';
import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { createCategoryDtoMock } from '@test/mocks/dtos/createCategory.dto.mock';
import { categoryMock } from '@test/mocks/entities/category.mock';
import { userMock } from '@test/mocks/entities/user.mock';
import { categoryRepositoryMock } from '@test/mocks/repositories/category.repository.mock';
import { userRepositoryMock } from '@test/mocks/repositories/user.repository.mock';

describe('Category Service', () => {
  let categoryService: CategoryService;
  let categoryRepository: CategoryRepository;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        JwtService,
        {
          provide: CategoryRepository,
          useFactory: categoryRepositoryMock,
        },
        {
          provide: UserRepository,
          useFactory: userRepositoryMock,
        },
      ],
    }).compile();

    categoryRepository = app.get<CategoryRepository>(CategoryRepository);
    categoryService = app.get<CategoryService>(CategoryService);
    userRepository = app.get<UserRepository>(UserRepository);
  });

  describe('createCategory', () => {
    it('Should return category ID', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(userMock);
      jest
        .spyOn(categoryRepository, 'createCategory')
        .mockResolvedValueOnce(categoryMock);
      const response = await categoryService.createCategory(
        createCategoryDtoMock,
        userMock.id,
      );
      expect(response).toEqual({ id: categoryMock.id });
    });
    it('Should throw UnauthorizedError if user is not found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(null);
      await expect(
        categoryService.createCategory(createCategoryDtoMock, userMock.id),
      ).rejects.toThrow(new UnauthorizedError('Invalid token'));
    });
  });

  describe('getCategoriesForUser', () => {
    it('Should return categories array', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(userMock);
      jest
        .spyOn(categoryRepository, 'getByUser')
        .mockResolvedValueOnce([categoryMock]);
      const response = await categoryService.getCategoriesForUser(userMock.id);
      expect(response).toEqual([categoryMock]);
    });
    it('Should throw UnauthorizedError if user is not found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(null);
      await expect(
        categoryService.getCategoriesForUser(userMock.id),
      ).rejects.toThrow(new UnauthorizedError('Invalid token.'));
    });
  });
});
