import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[Error]', err.message);

  const statusCode = err.statusCode ?? 500;
  const message    = statusCode < 500 ? err.message : 'Internal server error';

  res.status(statusCode).json({ success: false, message });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, message: 'Route not found' });
}

/** Convenience — throw this from any route to return a clean HTTP error */
export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}
