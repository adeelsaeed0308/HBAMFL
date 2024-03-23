//handle async errors
const {ErrorResponse} = require('../utils/errors');
const tryToParse = require('../utils/tryToParse');

const errorHandler = (err, req, res, next) => {
  console.error(err);
  try {
    if (typeof err === 'string') {
      err = { message: err };
    }

    if (err.stack) console.log(err.stack);
    console.log(err);
    let error = { ...err };
    error.message = err?.message;
    // return res.json(error.errors);
    error.name = err.name;

    //invalid objectid
    if (error.kind === 'ObjectId') {
      const message = 'Invalid ObjectId';
      error = new ErrorResponse(message, 400);
    }

    //mongoose duplicate unique
    if (error.code === 11000) {
      const message = `${Object.keys(error.keyValue)[0]} has to be unique`;
      error = new ErrorResponse(message, 400);
    }

    //mongoose validation error
    if (error.name === 'ValidationError') {
      let message = [];
      for (const key in error.errors) {
        if (error.errors[key].kind === 'required') {
          message.push({
            field: key,
            message: `${error.errors[key].properties.path} is required`,
          });
        } else if (error.errors[key].kind === 'enum') {
          message.push({
            field: key,
            message: `${error.errors[key].properties.path} is an enum, enter one of the allowed values`,
          });
        } else {
          message.push({
            field: key,
            message: error.errors[key].message,
          });
        }
      }
      error = new ErrorResponse(JSON.stringify(message[0]), 400);
    }
    if (error.cookie) {
      res.clearCookie('token');
    }
    res.status(error?.statusCode || 500).json({
      error: tryToParse(error?.message) || { message: 'Internal server error' },
    });
  } catch (error) {
    console.log(error);
    if (error.cookie) {
      res.clearCookie('token');
    }
    res.status(error?.statusCode || 500).json({
      error: tryToParse(error?.message) || { message: 'Internal server error' },
    });
  }
};

module.exports = errorHandler;
