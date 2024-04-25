export const noteRepositoryMock = (): unknown => ({
  createNote: jest.fn(),
  getById: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
});
