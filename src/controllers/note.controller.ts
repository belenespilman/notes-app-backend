import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { AuthenticateGuard } from '@/guards/authenticate.guard';
import { EntityCreatedResponse } from '@/models/classes/entityCreatedResponse.class';
import { SuccessOperationResponse } from '@/models/classes/successOperationResponse.class';
import { CreateNoteDto } from '@/models/dtos/createNote.dto';
import { UpdateNoteDto } from '@/models/dtos/updateNote.dto';
import { Note } from '@/models/entities/note.entity';
import { NoteService } from '@/services/note.service';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('')
  @UseGuards(AuthenticateGuard)
  createNote(
    @Req() request: Request,
    @Body() body: CreateNoteDto,
  ): Promise<EntityCreatedResponse> {
    const userId = request['user'].id;
    return this.noteService.createNote(body, userId);
  }

  @Patch('/:noteId/category/:categoryId/add')
  @UseGuards(AuthenticateGuard)
  addCategoryToNote(
    @Param('noteId') noteId: string,
    @Param('categoryId') categoryId: string,
    @Req() request: Request,
  ): Promise<SuccessOperationResponse> {
    const userId = request['user'].id;
    return this.noteService.modifyNoteCategory(
      noteId,
      categoryId,
      userId,
      'ADD',
    );
  }

  @Patch('/:noteId/category/:categoryId/remove')
  @UseGuards(AuthenticateGuard)
  removeCategoryFromNote(
    @Param('noteId') noteId: string,
    @Param('categoryId') categoryId: string,
    @Req() request: Request,
  ): Promise<SuccessOperationResponse> {
    const userId = request['user'].id;
    return this.noteService.modifyNoteCategory(
      noteId,
      categoryId,
      userId,
      'REMOVE',
    );
  }

  @Patch('/:noteId')
  @UseGuards(AuthenticateGuard)
  updateNote(
    @Param('noteId') noteId: string,
    @Body() body: UpdateNoteDto,
    @Req() request: Request,
  ): Promise<SuccessOperationResponse> {
    const userId = request['user'].id;
    return this.noteService.updateNote(noteId, userId, body);
  }

  @Delete('/:noteId')
  @UseGuards(AuthenticateGuard)
  deleteNote(
    @Param('noteId') noteId: string,
    @Req() request: Request,
  ): Promise<SuccessOperationResponse> {
    const userId = request['user'].id;
    return this.noteService.deleteNote(noteId, userId);
  }

  @Get('/')
  @UseGuards(AuthenticateGuard)
  getNotesByCategoryId(
    @Query('categoryId') categoryId: string,
    @Req() request: Request,
  ): Promise<Note[]> {
    const userId = request['user'].id;
    return this.noteService.getNotesByCategoryId(userId, categoryId);
  }
}
