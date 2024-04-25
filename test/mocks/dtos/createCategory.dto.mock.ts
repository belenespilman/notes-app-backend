import { CreateCategoryDto } from '@/models/dtos/createCategory.dto';
import { faker } from '@faker-js/faker';

export const createCategoryDtoMock: CreateCategoryDto = {
  name: faker.string.sample(),
};
