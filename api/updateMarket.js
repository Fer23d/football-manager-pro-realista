const saveGame = require('./saveGame');

module.exports = async function handler(req, res) {
  return saveGame(req, res);
};
