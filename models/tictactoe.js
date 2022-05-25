const {Sequelize} = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define('tictactoe', {
        user_id: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        score: {
            type: Sequelize.INTEGER, 
            defaultValue: 0, 
            allowNull: false,   
        }

    })
}

