export const userRepositoryMock = (): unknown => ({
  createUser: jest.fn(),
  findByUsername: jest.fn(),
  getById: jest.fn(),
  getProfile: jest.fn(),
});
