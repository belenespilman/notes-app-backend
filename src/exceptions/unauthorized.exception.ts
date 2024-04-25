import { UnauthorizedException } from '@nestjs/common';

export class UnauthorizedError extends UnauthorizedException {
  constructor(message) {
    super(message, 'Unauthorized.');
  }
}
