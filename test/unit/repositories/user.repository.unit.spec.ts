import { DatabaseError } from '@/exceptions/database.exception';
import { User } from '@/models/entities/user.entity';
import { UserRepository } from '@/repositories/user.repository';
import { faker } from '@faker-js/faker';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createUserDtoMock } from '@test/mocks/dtos/createUser.dto.mock';
import { userMock, userProfileMock } from '@test/mocks/entities/user.mock';
import { userRepositoryMock } from '@test/mocks/repositories/user.repository.mock';
import { Repository } from 'typeorm';

describe('User Repository', () => {
  let userRepository: UserRepository;
  let userRepositoryMock: Repository<User>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();
    userRepository = app.get<UserRepository>(UserRepository);
    userRepositoryMock = app.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    it('Should return created user', async () => {
      jest.spyOn(userRepositoryMock, 'save').mockResolvedValueOnce(userMock);
      const response = await userRepository.createUser(createUserDtoMock);
      expect(response).toEqual(userMock);
    });
    it('Should throw DatabaseError if save fails', async () => {
      const errorMessage: string = faker.string.sample();
      jest
        .spyOn(userRepositoryMock, 'save')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(
        userRepository.createUser(createUserDtoMock),
      ).rejects.toThrow(new DatabaseError(errorMessage));
    });
  });

  describe('findByUsername', () => {
    it('Should return user', async () => {
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValueOnce(userMock);
      const response = await userRepository.findByUsername(userMock.username);
      expect(response).toEqual(userMock);
    });
    it('Should throw DatabaseError if findOne fails', async () => {
      const errorMessage: string = faker.string.sample();
      jest
        .spyOn(userRepositoryMock, 'findOne')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(
        userRepository.findByUsername(userMock.username),
      ).rejects.toThrow(new DatabaseError(errorMessage));
    });
  });

  describe('getById', () => {
    it('Should return user', async () => {
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValueOnce(userMock);
      const response = await userRepository.getById(userMock.id);
      expect(response).toEqual(userMock);
    });
    it('Should throw DatabaseError if findOne fails', async () => {
      const errorMessage: string = faker.string.sample();
      jest
        .spyOn(userRepositoryMock, 'findOne')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(userRepository.getById(userMock.id)).rejects.toThrow(
        new DatabaseError(errorMessage),
      );
    });
  });

  describe('getProfile', () => {
    it('Should return user profile', async () => {
      jest.spyOn(userRepositoryMock, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(userProfileMock),
      } as never);
      const response = await userRepository.getProfile(userMock.id);
      expect(response).toEqual(userProfileMock);
    });
    it('Should throw DatabaseError if query fails', async () => {
      const errorMessage: string = faker.string.sample();
      jest.spyOn(userRepositoryMock, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
      } as never);
      await expect(userRepository.getProfile(userMock.id)).rejects.toThrow(
        new DatabaseError(errorMessage),
      );
    });
  });
});
