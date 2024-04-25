import { faker } from '@faker-js/faker';
import { UserProfile } from 'src/models/classes/userProfile.class';
import { User } from 'src/models/entities/user.entity';
import { categoryMock } from './category.mock';

export const userProfileMock: UserProfile = {
  id: faker.string.uuid(),
  username: faker.string.sample(),
  activeNotes: [
    {
      id: faker.string.uuid(),
      active: true,
      categories: [categoryMock],
      createdAt: faker.date.past(),
      title: faker.string.sample(),
      updatedAt: faker.date.past(),
    },
  ],
  archivedNotes: [
    {
      id: faker.string.uuid(),
      active: false,
      categories: [categoryMock],
      createdAt: faker.date.past(),
      title: faker.string.sample(),
      updatedAt: faker.date.past(),
    },
  ],
  categories: [categoryMock],
};

export const userMock = {
  id: faker.string.uuid(),
  password: faker.string.sample(),
  username: faker.string.sample(),
} as User;
