import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { environment } from '@/config/environment';
import { NotFoundError } from '@/exceptions/notFound.exception';
import { UnauthorizedError } from '@/exceptions/unauthorized.exception';
import { TokenResponse } from '@/models/classes/tokenResponse.class';
import { UserNote, UserProfile } from '@/models/classes/userProfile.class';
import { CreateUserDto } from '@/models/dtos/createUser.dto';
import { UserRepository } from '@/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<TokenResponse> {
    const salt = genSaltSync(environment.saltRounds);
    const hashedPassword = hashSync(dto.password, salt);

    const { id, username } = await this.userRepository.createUser({
      username: dto.username,
      password: hashedPassword,
    });

    const accessToken = await this.jwtService.signAsync({ id, username });

    return {
      accessToken,
    };
  }

  async authenticateUser(dto: CreateUserDto): Promise<TokenResponse> {
    const user = await this.userRepository.findByUsername(dto.username);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const passwordMatch = compareSync(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid username or password.');
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      username: user.username,
    });

    return { accessToken };
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const data = await this.userRepository.getProfile(userId);

    if (!data) {
      throw new UnauthorizedError('Invalid Token');
    }

    let archivedNotes: UserNote[] = [];
    let activeNotes: UserNote[] = [];

    data.notes.forEach((note) => {
      const categories = note.categoryNotes.map(({ category }) => {
        return {
          id: category.id,
          name: category.name,
        };
      });
      const parsedNote: UserNote = {
        id: note.id,
        title: note.title,
        active: note.active,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        categories,
      };
      if (note.active) {
        activeNotes.push(parsedNote);
      } else {
        archivedNotes.push(parsedNote);
      }
    });

    return {
      id: data.id,
      username: data.username,
      activeNotes,
      archivedNotes,
      categories: data.categories,
    };
  }
}
