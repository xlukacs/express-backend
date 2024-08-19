const Pool = require('pg').Pool;
const logger = require('../logger')

// const pool = new Pool({
//     user: process.env.database_username,
//     host: process.env.database_host,
//     database: process.env.database_database,
//     password: process.env.database_password,
//     dialect: 'postgres',
//     port: process.env.database_port,
//     max: 5
// });

const pool = new Pool({
    user: process.env.database_username_prod,
    host: process.env.database_host_prod,
    database: process.env.database_database_prod,
    password: process.env.database_password_prod,
    dialect: 'postgres',
    port: process.env.database_port_prod,
    max: process.env.max_conections,
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000
});

logger.info("Connecting to Database...")
logger.info("Database: ", process.env.database_database_prod)
logger.info("Host: ", process.env.database_host_prod)
logger.info("Port: ", process.env.database_port_prod)
logger.info("User: ", process.env.database_username_prod)
logger.info("Password: ", process.env.database_password_prod)


pool.connect((err, client, release) => {
    if (err) {
        return console.error(
            'Error acquiring client', err.stack)
    }
    // client.query("SELECT tablename FROM pg_tables", (err, result) => {
    client.query("SELECT NOW()", (err, result) => {
        release()
        if (err) {
            return console.error(
                'Error executing query', err.stack)
        }
        // console.log(result.rows)
        logger.info("Connected to Database !")
    })
})

module.exports = pool