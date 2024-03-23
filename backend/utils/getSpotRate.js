const { default: axios } = require("axios");

const getSpotRate = async (from, to) => {
  if (from === to) return 1;
  try {
    const { data } = await axios.get(
      "https://api.apilayer.com/exchangerates_data/convert",
      {
        params: {
          from,
          to,
          amount: 1,
        },
        headers: {
          apiKey: process.env.EXCHANGE_RATE_API_TOKEN,
        },
      }
    );
    return data.result;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = { getSpotRate };
