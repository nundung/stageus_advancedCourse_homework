const router = require("express").Router()
const redis = require("redis").createClient()
const { isToken } = require("../middlewares/isToken")


router.get("/",
    isToken,
    async (req, res, next) => {
        const result = {
            "message": "",
            "data": {
                "visitor": null
            }
        }
        try {
            await redis.connect()
            const visitor = await redis.sCard("visitor")
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