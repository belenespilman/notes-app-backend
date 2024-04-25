export const categoryNoteRepositoryMock = (): unknown => ({
  addCategoriesToNote: jest.fn(),
  removeCategoryFromNote: jest.fn(),
  addCategoryToNote: jest.fn(),
  getNotesByCategory: jest.fn(),
});
