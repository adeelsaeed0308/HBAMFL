const { MissingRequiredError, ErrorResponse } = require('../utils/errors');

const checkFields = (fields, allowedFields, requiredFields) => {
  if (requiredFields === true) {
    requiredFields = [...allowedFields];
  }

  if (Array.isArray(fields) || !(fields instanceof Object)) {
    return new ErrorResponse(JSON.stringify({ message: 'Body has to be an object' }), 400);
  }

  if (allowedFields) {
    const goodFields = allowedFields;
    let badFields;
    badFields = Object.keys(fields).filter((e) => !goodFields.includes(e));

    if (badFields.length > 0) {
      const message = { field: badFields[0], message: 'Field unrecognized' };
      return new ErrorResponse(JSON.stringify(message), 400);
    }
  }

  if (requiredFields) {
    let missingFields;
    missingFields = requiredFields.filter((e) => !Object.keys(fields).includes(e));
    if (missingFields.length > 0) {
      return new MissingRequiredError(missingFields[0]);
    }
  }
};

module.exports = checkFields;
