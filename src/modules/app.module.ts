import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '@/config/environment';
import { CategoryController } from '@/controllers/category.controller';
import { NoteController } from '@/controllers/note.controller';
import { UserController } from '@/controllers/user.controller';
import { CategoryRepository } from '@/repositories/category.repository';
import { NoteRepository } from '@/repositories/note.repository';
import { CategoryNoteRepository } from '@/repositories/noteCategory.repository';
import { UserRepository } from '@/repositories/user.repository';
import { CategoryService } from '@/services/category.service';
import { NoteService } from '@/services/note.service';
import { UserService } from '@/services/user.service';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: environment.jwt.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [
    AppController,
    UserController,
    CategoryController,
    NoteController,
  ],
  providers: [
    AppService,
    UserService,
    UserRepository,
    CategoryService,
    CategoryRepository,
    NoteService,
    NoteRepository,
    CategoryNoteRepository,
  ],
})
export class AppModule {}
