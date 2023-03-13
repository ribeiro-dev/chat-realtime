const Sequelize = require('sequelize')
const connection = require('./database')

const Message = connection.define('messages', {
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    userName: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    userColor: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Message.sync({ force: false })

module.exports = Message