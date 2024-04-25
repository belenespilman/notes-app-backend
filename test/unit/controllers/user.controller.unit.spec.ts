import { UserController } from '@/controllers/user.controller';
import { UserService } from '@/services/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@/repositories/user.repository';
import { userRepositoryMock } from '@test/mocks/repositories/user.repository.mock';
import { faker } from '@faker-js/faker';
import { TokenResponse } from '@/models/classes/tokenResponse.class';
import { createUserDtoMock } from '@test/mocks/dtos/createUser.dto.mock';
import { userProfileMock } from '@test/mocks/entities/user.mock';
import { requestMock } from '@test/mocks/request.mock';
import { JwtService } from '@nestjs/jwt';

describe('User Controller', () => {
  let userController: UserController;
  let userService: UserService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        JwtService,
        { provide: UserRepository, useFactory: userRepositoryMock },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('Should return TokenResponse', async () => {
      const tokenResponse: TokenResponse = {
        accessToken: faker.string.sample(),
      };
      jest
        .spyOn(userService, 'createUser')
        .mockResolvedValueOnce(tokenResponse);
      const response = await userController.crateUser(createUserDtoMock);
      expect(response).toEqual(tokenResponse);
    });
  });

  describe('signInUser', () => {
    it('Should return token response', async () => {
      const tokenResponse: TokenResponse = {
        accessToken: faker.string.sample(),
      };
      jest
        .spyOn(userService, 'authenticateUser')
        .mockResolvedValueOnce(tokenResponse);
      const response = await userController.signInUser(createUserDtoMock);
      expect(response).toEqual(tokenResponse);
    });
  });

  describe('getProfile', () => {
    it('Should return user profile', async () => {
      jest
        .spyOn(userService, 'getProfile')
        .mockResolvedValueOnce(userProfileMock);
      const response = await userController.getProfile(requestMock);
      expect(response).toEqual(userProfileMock);
    });
  });
});
