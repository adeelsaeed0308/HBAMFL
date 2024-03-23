const asyncHandler = (fn) => (...args) =>
  Promise.resolve(fn(...args))
    //the last arg should be next function to throw error
    .catch(args[args.length - 1]);

module.exports = asyncHandler;
