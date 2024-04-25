import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';
import { Note } from './note.entity';

@Entity('category-note')
export class CategoryNote extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Category, (category) => category.categoryNotes)
  category: Category;

  @ManyToOne(() => Note, (note) => note.categoryNotes)
  note: Note;
}
