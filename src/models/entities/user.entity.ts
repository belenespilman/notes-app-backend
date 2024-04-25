import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Note } from './note.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];
}
