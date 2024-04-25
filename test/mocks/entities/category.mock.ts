import { faker } from '@faker-js/faker';
import { Category } from 'src/models/entities/category.entity';

export const categoryMock = {
  id: faker.string.uuid(),
  name: faker.string.sample(),
} as Category;
