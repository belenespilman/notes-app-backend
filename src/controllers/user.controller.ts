import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticateGuard } from '@/guards/authenticate.guard';
import { TokenResponse } from '@/models/classes/tokenResponse.class';
import { UserProfile } from '@/models/classes/userProfile.class';
import { CreateUserDto } from '@/models/dtos/createUser.dto';
import { UserService } from '@/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  crateUser(@Body() body: CreateUserDto): Promise<TokenResponse> {
    return this.userService.createUser(body);
  }

  @Post('/signin')
  signInUser(@Body() body: CreateUserDto): Promise<TokenResponse> {
    return this.userService.authenticateUser(body);
  }

  @Get('/profile')
  @UseGuards(AuthenticateGuard)
  getProfile(@Req() request: Request): Promise<UserProfile> {
    const userId = request['user'].id;
    return this.userService.getProfile(userId);
  }
}
