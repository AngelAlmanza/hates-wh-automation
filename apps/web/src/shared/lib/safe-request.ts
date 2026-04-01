import axios from 'axios';
import type { Either } from '../types/either';
import type { ApiError } from '../types/api-error';

export function isLeft<L, R>(
  either: Either<L, R>,
): either is { left: L; right?: never } {
  return either.left !== undefined;
}

export function isRight<L, R>(
  either: Either<L, R>,
): either is { left?: never; right: R } {
  return either.right !== undefined;
}

export async function safeRequest<T>(
  fn: () => Promise<T>,
): Promise<Either<ApiError, T>> {
  try {
    const data = await fn();
    return { right: data };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data) {
      const body = err.response.data as Partial<ApiError>;
      return {
        left: {
          message: body.message ?? 'Error desconocido',
          error: body.error ?? 'Error',
          statusCode: body.statusCode ?? err.response.status,
          errors: Array.isArray(body.errors) ? body.errors : undefined,
        },
      };
    }
    return {
      left: {
        message: 'Error de conexión. Intenta nuevamente.',
        error: 'Network Error',
        statusCode: 0,
      },
    };
  }
}
