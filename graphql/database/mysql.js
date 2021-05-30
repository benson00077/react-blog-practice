require('dotenv').config()

let config = {
    client: 'mysql2',
    connection: {
        host:process.env.MYSQL_HOST,
        user:process.env.MYSQL_USER,
        databases:process.env.MYSQL_PASS,
        password:process.env.MYSQL_DB,
        multipleStatements: true
    }
}

// require knex, instantiate it and return the connection
module.exports = require('knex')(config)