require('dotenv').config()

const Sequelize = require('sequelize')
const connection = new Sequelize({
    dialect: 'sqlite',
    storage: './data/data.sqlite',
    logging: false
})

module.exports = connection