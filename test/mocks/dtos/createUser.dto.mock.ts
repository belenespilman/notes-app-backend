import { faker } from '@faker-js/faker';
import { CreateUserDto } from 'src/models/dtos/createUser.dto';

export const createUserDtoMock: CreateUserDto = {
  password: faker.string.sample(),
  username: faker.string.sample(),
};
