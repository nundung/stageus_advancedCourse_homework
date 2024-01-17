const router = require("express").Router()
const redis = require("redis").createClient()

router.get("/", async (req, res, next) => {
    const result = {
        "success": false,
        "message": "",
        "data": {
            "visitor": null
        }
    }
    try {
        await redis.connect()
        const visitor = await redis.sCard("visitor")
        await redis.disconnect()
        console.log("실행")
        result.data.visitor = visitor
        result.success = true
        res.status(200).send(result)
    }
    catch (err) {
        next (err)
    }
})

module.exports = router