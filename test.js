const { StatusCodes } = require('http-status-codes');

// Найти название ошибки по номеру
const statusCode = 401; // Пример: Internal Server Error
const errorName = StatusCodes[statusCode];

console.log(errorName);
