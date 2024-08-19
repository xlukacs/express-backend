require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const morgan = require('morgan');
const logger = require('./logger');

const app = express();

logger.info("Starting server...")

//CHECK IF ENVIRONMENT VARIABLES ARE SET
const exprectedEnvVariables = ['db_usr','db_pass','db_host', 'db_port','db_name','frontend_url','max_connections', 'SECRET_KEY'];
const missingEnvVariables = exprectedEnvVariables.filter((envVar) => !process.env[envVar]);
if (missingEnvVariables.length > 0) {
    logger.error(`Missing environment variables: ${missingEnvVariables.join(', ')}`);
    process.exit(1);
}

// SETUP CORS
const allowedOrigins = [
    process.env.frontend_url,
    'http://localhost:9000',
]
const corsOptions = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
}
app.use(cors(corsOptions));

// SETUP API FOR LOGGING
logger.info("Setting up API for logging...")
morgan.token('user', (req) => {
    if (req.user) 
        return `User: ${req.user.username}`;
    
    return 'User: anonymous';
});
// Setup morgan with custom user token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :user', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Internal server error!');
});
app.use(cors(corsOptions));

// Set higher limit for image/PLU uploads
logger.info("Setting up API for image/PLU uploads...")
app.use(express.json({ limit: '50mb' }));
app.use(express.raw({ limit: '50mb' }));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    next();
});
 
//SETUP SERVER, later for socket handling
logger.info("Setting up server...")
const server = app.listen(3000, '0.0.0.0', function () {
    let host = server.address().address
    let port = server.address().port
    logger.info(`Express server is listening on: http://${host}:${port}`);
})


//==============API CALLS=================
try {
    logger.info("Setting up API routes...")

	const baseRouter = require('./API/base')
    logger.info("API routes loaded")

	app.use('/API/base', baseRouter)
    logger.info("API routes set")
} catch (err) {
    logger.error('Error requiring API routes:', err);
}



//==============EXPERIMENTAL CALLS=================
logger.info("Setting up default 4xx API calls...")
app.all('/', (req,res) => {
    logger.warning("404 not found API call.")
    logger.info(req)
    res.status(404).send("Invalid API call.")
})


//==============ERROR HANDLING===============
// Health check endpoint
logger.info("Setting up health check endpoint...")
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
logger.info("Server setup complete.")


//==============SETUP NODE TO HANDLE LIFECYCLE===============
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception thrown', err);
    // Recommended: Restart the server if needed or exit gracefully
    process.exit(1);
});


