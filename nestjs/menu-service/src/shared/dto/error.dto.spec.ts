import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from './error.dto';

describe('ErrorDto', () => {
  it('should have empty details with default constructor', () => {
    const error = new ErrorDto(HttpStatus.OK, 'my error');
    expect(error.error).toEqual('my error');
  });

  it('should have the right details', () => {
    const error = new ErrorDto(HttpStatus.OK, 'my error', 'my details');
    expect(error.error).toEqual('my error');
    expect(error.details).toEqual('my details');
  });
})
