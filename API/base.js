const express = require('express')
const pool = require('../core/database')

const router = express.Router();

const authMiddleware = require('../core/middleware/isAuthenticated');
const logger = require('../logger')

logger.info("Base API loaded")

router.get('/test', async (req, res) => {
    try{
        logger.info("Test endpoint served")
        res.status(200).json({ message: "Test endpoint working as intended" })
    } catch(err){
        logger.error("Error while serving base endpoint: ", err)
        res.status(500).json({ error: "Internal server error - code: 1" })   
    }
})

router.get('/getEndpoint', authMiddleware, async (req, res) => {
    try{
        var query = ""
        const result = await pool.query(query, [])
    
        logger.info("")
        res.status(200).json({ data: result.rows })
    } catch(err){
        logger.error("Error msg: ", err)
        res.status(500).json({ error: "Internal server error - code: XX" })   
    }
})

router.post('/postEndpoint', authMiddleware, async (req, res) => {
    try{
        if(!req.body.hasOwnProperty('prop1')){
            logger.warn("Missing argument")
            res.status(500).json({error: "Missing argument - code: XX"})
            return
        }

       
        
        logger.info("")
        res.status(200).json({ data: "" })
    } catch(err){
        logger.error("Error msg: ", err)
        res.status(500).json({ error: "Internal server error - code: XX" })   
    }
})


module.exports = router;