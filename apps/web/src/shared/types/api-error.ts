export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
  errors?: string[];
}
