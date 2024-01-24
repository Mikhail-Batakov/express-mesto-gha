const { StatusCodes } = require('http-status-codes');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;

// const { StatusCodes } = require('http-status-codes');

// // Найти название ошибки по номеру
// const statusCode = 201; // Пример: Internal Server Error
// const errorName = StatusCodes[statusCode];

// console.log(errorName);
