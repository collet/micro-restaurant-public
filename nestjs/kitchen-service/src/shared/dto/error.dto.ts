import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorDto extends HttpException {
  error: string;
  details: string;

  constructor(status: HttpStatus, error: string, details: string = '') {
    super({ error, details }, status);

    this.error = error;
    this.details = details;
  }
}
