export class UnauthorizedError extends Error {
    readonly statusCode = 401;
    constructor(message: string) { super(message); this.name = 'UnauthorizedError'; }
}
 
export class ConflictError extends Error {
    readonly statusCode = 409;
    constructor(message: string) { super(message); this.name = 'ConflictError'; }
}

export class NotFoundError extends Error {
    readonly statusCode = 404;
    constructor(message: string) { super(message); this.name = 'NotFoundError'; }
}