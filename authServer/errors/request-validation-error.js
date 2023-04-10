const CustomError = require('./custom-error');

class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(errors) {
    super('invalid request parameters');

    // Only beacouse we extend built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}

module.exports = RequestValidationError;
