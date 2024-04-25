import { NotFoundError } from '@/exceptions/notFound.exception';
import { UnauthorizedError } from '@/exceptions/unauthorized.exception';
import { UserRepository } from '@/repositories/user.repository';
import { UserService } from '@/services/user.service';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { createUserDtoMock } from '@test/mocks/dtos/createUser.dto.mock';
import { categoryMock } from '@test/mocks/entities/category.mock';
import { noteMock } from '@test/mocks/entities/note.mock';
import { userMock } from '@test/mocks/entities/user.mock';
import { userRepositoryMock } from '@test/mocks/repositories/user.repository.mock';
import * as bcryptjs from 'bcryptjs';

describe('User Service', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  const accessToken = faker.string.sample();
  const jwtServiceMock = () => ({
    signAsync: jest.fn().mockResolvedValue(accessToken),
  });

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: JwtService,
          useFactory: jwtServiceMock,
        },
        {
          provide: UserRepository,
          useFactory: userRepositoryMock,
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
    userRepository = app.get<UserRepository>(UserRepository);
  });

  describe('createUser', () => {
    it('Should return token response', async () => {
      jest.spyOn(userRepository, 'createUser').mockResolvedValueOnce(userMock);
      const response = await userService.createUser(createUserDtoMock);
      expect(response).toEqual({ accessToken });
    });
  });

  describe('authenticateUser', () => {
    it('Should return token response', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(userMock);
      jest.spyOn(bcryptjs, 'compareSync').mockReturnValueOnce(true);
      const response = await userService.authenticateUser(createUserDtoMock);
      expect(response).toEqual({ accessToken });
    });
    it('Should throw NotFoundError if user is not found', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);
      await expect(
        userService.authenticateUser(createUserDtoMock),
      ).rejects.toThrow(new NotFoundError('User not found'));
    });
    it('Should throw UnauthorizedError if passwords do not match', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(userMock);
      jest.spyOn(bcryptjs, 'compareSync').mockReturnValueOnce(false);
      await expect(
        userService.authenticateUser(createUserDtoMock),
      ).rejects.toThrow(new UnauthorizedError('Invalid username or password.'));
    });
  });

  describe('getProfile', () => {
    it('Should return user profile', async () => {
      jest.spyOn(userRepository, 'getProfile').mockResolvedValue({
        ...userMock,
        notes: [
          {
            ...noteMock,
            active: true,
            categoryNotes: [{ category: categoryMock }],
          },
          {
            ...noteMock,
            active: false,
            categoryNotes: [{ category: categoryMock }],
          },
        ],
      } as never);
      const response = await userService.getProfile(userMock.id);
      expect(response.id).toEqual(userMock.id);
      expect(response.username).toEqual(userMock.username);
      expect(response.activeNotes).toHaveLength(1);
      expect(response.archivedNotes).toHaveLength(1);
      expect(response.categories).toEqual(userMock.categories);
    });
    it('Should throw UnauthorizedError if no data is found', async () => {
      jest.spyOn(userRepository, 'getProfile').mockResolvedValueOnce(null);
      await expect(userService.getProfile(userMock.id)).rejects.toThrow(
        new UnauthorizedError('Invalid Token'),
      );
    });
  });
});
