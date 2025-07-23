export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Not Found Error';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Validation Error';
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Database Error';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Conflict Error';
  }
}
