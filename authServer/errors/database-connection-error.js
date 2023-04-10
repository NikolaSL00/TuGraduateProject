const CustomError = require('./custom-error');

class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to the database';
  constructor() {
    super('error connecting to the db');

    // Only beacouse we extend built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

module.exports = DatabaseConnectionError;
