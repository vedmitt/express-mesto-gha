class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class NotExistError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotExistError';
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
  ValidationError,
  NotExistError,
  DefaultError,
};
