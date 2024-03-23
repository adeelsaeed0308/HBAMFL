const tryToParse = require('./tryToParse');

class ErrorResponse extends Error {
  constructor(message, statusCode = 400, cookie) {
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    super(message);
    this.statusCode = statusCode;
    this.cookie = cookie;
  }
}

class MissingRequiredError extends ErrorResponse {
  constructor(field) {
    const message = { field, message: 'Missing Required' };
    super(JSON.stringify(message), 400);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(notFoundResource, status) {
    super(`${notFoundResource} not found`, status ?? 404);
  }
}

exports.ErrorResponse = ErrorResponse;
exports.NotFoundError = NotFoundError;
exports.MissingRequiredError = MissingRequiredError;
