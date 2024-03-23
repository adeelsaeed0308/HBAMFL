const getJSReport = () => {
  const client = require("@jsreport/nodejs-client")(
    process.env.JSREPORT_ENDPOINT,
    process.env.JSREPORT_USERNAME,
    process.env.JSREPORT_PASSWORD
  );
  return client;
};

module.exports = { getJSReport };
