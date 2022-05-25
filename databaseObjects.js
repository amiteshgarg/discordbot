const Sequelize = require('sequelize')

// instance of sequelize (name, username, password, {host})
const sequelize = new Sequelize('discordbot', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const TicTacToe = require('./models/tictactoe.js')(sequelize) 

module.exports = {TicTacToe};