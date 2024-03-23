const tryToParse = (string) => {
  try {
    const json = JSON.parse(string);
    return json;
  } catch (error) {
    return {
      message: string,
    };
  }
};
module.exports = tryToParse;
