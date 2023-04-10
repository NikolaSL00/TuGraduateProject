const CustomError = require('./custom-error');

class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super('Route not found');

    // Only beacouse we extend built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not found' }];
  }
}

module.exports = NotFoundError;
