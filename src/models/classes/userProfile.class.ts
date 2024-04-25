export class UserProfile {
  id: string;
  username: string;
  activeNotes?: UserNote[];
  archivedNotes?: UserNote[];
  categories?: NoteCategory[];
}

export class UserNote {
  id: string;
  title: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: NoteCategory[];
}

class NoteCategory {
  id: string;
  name: string;
}
