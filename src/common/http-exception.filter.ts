import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code: number;
    let msg: string;

    if (exception instanceof HttpException) {
      code = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      msg =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (
              exceptionResponse as { message?: string | string[] }
            ).message?.toString() || exception.message;
    } else {
      code = HttpStatus.INTERNAL_SERVER_ERROR;
      msg = '服务器内部错误';
    }

    response.status(code).json({ code, msg });
  }
}
