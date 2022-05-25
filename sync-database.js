const Sequelize = require('sequelize')

// instance of sequelize (name, username, password, {host})
const sequelize = new Sequelize('discordbot', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

require('./models/tictactoe.js')(sequelize) 

sequelize.sync().then(async () => {
    console.log('Database synced');
    sequelize.close();
}).catch(console.error);
