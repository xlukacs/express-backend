const jwt = require('jsonwebtoken')

const logger = require('../../logger')

// Middleware to verify token
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (token == null) {
      logger.warn("Missing token")
      return res.sendStatus(401);
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        logger.error("Invalid token")
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  };

module.exports = authMiddleware




