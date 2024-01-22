const router = require("express").Router()
const redis = require("redis").createClient()
const { isToken } = require("../middlewares/isToken")


router.get(
    "/hour",
    isToken,
    async (req, res, next) => {
        const result = {
            "message": "",
            "data": {
                "visitor": null
            }
        }
        try {
            const VISITOR_HOUR_KEY = process.env.VISITOR_HOUR_KEY
            
            await redis.connect()
            const visitor = await redis.sCard(`${VISITOR_HOUR_KEY}`)
            await redis.disconnect()

            result.data.visitor = visitor
            res.status(200).send(result)
        }
        catch (err) {
            next (err)
        }
    }
)

router.get(
    "/day",
    isToken,
    async (req, res, next) => {
        const result = {
            "message": "",
            "data": {
                "visitor": null
            }
        }
        try {
            const VISITOR_DAY_KEY = process.env.VISITOR_DAY_KEY

            await redis.connect()
            const visitor = await redis.sCard(`${VISITOR_DAY_KEY}`)
            await redis.disconnect()
            
            result.data.visitor = visitor
            res.status(200).send(result)
        }
        catch (err) {
            next (err)
        }
    }
)
module.exports = router