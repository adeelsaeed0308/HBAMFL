var stream = require("stream");

function isReadableStream(obj) {
  return Boolean(
    obj instanceof stream.Stream &&
      typeof (obj._read === "function") &&
      typeof (obj._readableState === "object")
  );
}

module.exports = isReadableStream;
