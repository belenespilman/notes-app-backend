import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UnauthorizedError } from '@/exceptions/unauthorized.exception';

@Injectable()
export class AuthenticateGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedError('Invalid Token');
    }
    return true;
  }

  extractTokenFromHeader(request: Request): string {
    const token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedError('Token not found');
    }
    return token;
  }
}
