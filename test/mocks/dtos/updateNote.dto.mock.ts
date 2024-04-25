import { UpdateNoteDto } from '@/models/dtos/updateNote.dto';
import { faker } from '@faker-js/faker';

export const updateNoteDtoMock: UpdateNoteDto = {
  active: faker.datatype.boolean(),
  title: faker.string.sample(),
};
