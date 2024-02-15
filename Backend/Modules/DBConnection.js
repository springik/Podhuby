const initOptions = {
    capSQL: true
};

const pgp = require('pg-promise')(initOptions)

const connection = {
    host: process.env.DATABASE_URL,
    port: process.env.DATABAES_PORT,
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
}
const db = pgp(connection)

module.exports = db