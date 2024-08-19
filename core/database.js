const Pool = require('pg').Pool;
const logger = require('../logger')


const pool = new Pool({
    user: process.env.db_usr,
    host: process.env.db_host,
    database: process.env.db_name,
    password: process.env.db_pass,
    dialect: 'postgres',
    port: process.env.db_port,
    max: process.env.max_connections,
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000
});

logger.info("Connecting to Database...")
logger.info("Database: ", process.env.db_name)
logger.info("Host: ", process.env.db_host)
logger.info("Port: ", process.env.db_port)
logger.info("User: ", process.env.db_usr)
logger.info("Password: ", process.env.db_pass)


pool.connect((err, client, release) => {
    if (err) {
        return console.error(
            'Error acquiring client', err.stack)
    }
    client.query("SELECT NOW()", (err, result) => {
        release()
        if (err) {
            return console.error(
                'Error executing query', err.stack)
        }
        logger.info("Connected to Database !")
    })
})

module.exports = pool