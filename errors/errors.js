class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = 401;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class DefaultError extends Error {
  constructor(message = 'На сервере произошла ошибка') {
    super(message);
    this.name = 'DefaultError';
    this.statusCode = 500;
  }
}

module.exports = {
  AuthError,
  ValidationError,
  NotFoundError,
  DefaultError,
};
