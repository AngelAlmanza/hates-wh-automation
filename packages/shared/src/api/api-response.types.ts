export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
  errors?: string[];
}
