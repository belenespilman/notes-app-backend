import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CategoryNote } from './categoryNote.entity';
import { User } from './user.entity';

@Entity('categories')
@Unique(['name', 'user'])
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @OneToMany(() => CategoryNote, (categoryNote) => categoryNote.category)
  categoryNotes: CategoryNote[];
}
