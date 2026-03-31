import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        response.status(status).json({
          message: exceptionResponse,
          error: HttpStatus[status] ?? 'Error',
          statusCode: status,
        });
        return;
      }

      const responseObj = exceptionResponse as Record<string, unknown>;

      // Errores de validación: message es un array de strings
      const isValidationError = Array.isArray(responseObj.message);
      const message = isValidationError
        ? 'Error de validación'
        : responseObj.message;

      const body: Record<string, unknown> = {
        message,
        error: responseObj.error ?? 'Error',
        statusCode: status,
      };

      if (isValidationError) {
        body.errors = responseObj.message;
      }

      response.status(status).json(body);
    } else {
      this.logger.error(
        'Excepción no controlada',
        exception instanceof Error ? exception.stack : String(exception),
      );

      response.status(status).json({
        message: 'Error interno del servidor',
        error: 'Internal Server Error',
        statusCode: status,
      });
    }
  }
}
