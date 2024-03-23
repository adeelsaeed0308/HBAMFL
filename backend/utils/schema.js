exports.PhoneField = {
  type: String,
  match: [/^[0-9]*$/, 'Only number please'],
  minlength: [10, 'Must be 10 characters long'],
  maxlength: [10, 'Must be 10 characters long'],
};

exports.RequiredPhoneField = {
  ...exports.PhoneField,
  required: true,
};
