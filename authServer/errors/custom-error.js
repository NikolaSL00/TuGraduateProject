class CustomError extends Error {
  statusCode;

  constructor(message) {
    super(message);

    // Only beacouse we extend built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors() {}
}

module.exports = CustomError;
