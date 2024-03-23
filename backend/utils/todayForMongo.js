const { startOfDay, endOfDay } = require("date-fns");

const todayForMongo = () => ({
  $gte: startOfDay(new Date()),
  $lt: endOfDay(new Date()),
});

module.exports = todayForMongo;
