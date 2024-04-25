import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '@/config/environment';
import { Category } from '@/models/entities/category.entity';
import { CategoryNote } from '@/models/entities/categoryNote.entity';
import { Note } from '@/models/entities/note.entity';
import { User } from '@/models/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environment.postgres.host,
      port: environment.postgres.port,
      username: environment.postgres.username,
      password: environment.postgres.password,
      database: environment.postgres.database,
      entities: [User, CategoryNote, Category, Note],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, CategoryNote, Category, Note]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
