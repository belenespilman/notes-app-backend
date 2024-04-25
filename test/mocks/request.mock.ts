import { faker } from '@faker-js/faker';

export const requestMock = {
  user: {
    id: faker.string.uuid(),
  },
} as never;
