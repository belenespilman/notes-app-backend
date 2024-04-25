export const categoryRepositoryMock = (): unknown => ({
  createCategory: jest.fn(),
  getById: jest.fn(),
  getByUser: jest.fn(),
});
