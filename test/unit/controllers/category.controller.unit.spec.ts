import { CategoryController } from '@/controllers/category.controller';
import { CategoryRepository } from '@/repositories/category.repository';
import { UserRepository } from '@/repositories/user.repository';
import { CategoryService } from '@/services/category.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { createCategoryDtoMock } from '@test/mocks/dtos/createCategory.dto.mock';
import { categoryMock } from '@test/mocks/entities/category.mock';
import { categoryRepositoryMock } from '@test/mocks/repositories/category.repository.mock';
import { userRepositoryMock } from '@test/mocks/repositories/user.repository.mock';
import { requestMock } from '@test/mocks/request.mock';

describe('Category Controller', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
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

    categoryController = app.get<CategoryController>(CategoryController);
    categoryService = app.get<CategoryService>(CategoryService);
  });

  describe('createCategory', () => {
    it('Should return category ID', async () => {
      jest
        .spyOn(categoryService, 'createCategory')
        .mockResolvedValueOnce({ id: categoryMock.id });
      const response = await categoryController.createCategory(
        requestMock,
        createCategoryDtoMock,
      );
      expect(response).toEqual({ id: categoryMock.id });
    });
  });

  describe('getUserCategories', () => {
    it('Should return category array', async () => {
      jest
        .spyOn(categoryService, 'getCategoriesForUser')
        .mockResolvedValueOnce([categoryMock]);
      const response = await categoryController.getUserCategories(requestMock);
      expect(response).toEqual([categoryMock]);
    });
  });
});
