const getSite = () => process.env.REACT_APP_SITE;

const isKanda = () => getSite() === "KANDA";

module.exports = { getSite, isKanda };
