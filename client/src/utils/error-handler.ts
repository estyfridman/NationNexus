export class ApiError extends Error {
  constructor(public statusCode: number, message: string, public originalError?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any) => {
  if (error?.response) {
    throw new ApiError(
      error.response.status,
      error.response.data?.message || 'An error occurred',
      error
    );
  }
  throw new Error(error.message || 'Network error occurred');
};
