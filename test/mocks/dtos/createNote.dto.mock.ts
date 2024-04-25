import { CreateNoteDto } from '@/models/dtos/createNote.dto';
import { faker } from '@faker-js/faker';

export const createNoteDtoMock: CreateNoteDto = {
  title: faker.string.sample(),
  categories: [faker.string.uuid()],
};
