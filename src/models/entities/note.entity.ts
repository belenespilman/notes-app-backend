import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryNote } from './categoryNote.entity';
import { User } from './user.entity';

@Entity('notes')
@Unique(['title', 'user'])
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;

  @ManyToOne(() => User, (user) => user.notes)
  user: User;

  @OneToMany(() => CategoryNote, (categoryNote) => categoryNote.note, {
    onDelete: 'CASCADE',
  })
  categoryNotes: CategoryNote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
