// Custom error class for the API
// Use this to throw errors with specific HTTP status codes
// Example: throw new AppError('User not found', 404);
export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}
