import { faker } from '@faker-js/faker';
import { Note } from 'src/models/entities/note.entity';
import { userMock } from './user.mock';

export const noteMock = {
  id: faker.string.uuid(),
  active: faker.datatype.boolean(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
  title: faker.string.sample(),
  user: userMock,
  categoryNotes: [],
} as Note;
