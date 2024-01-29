const router = require("express").Router()
const { isToken } = require("../middlewares/isToken")


router.get(
    "/hour",
    isToken,
)

router.get(
    "/day",
    isToken,
)
module.exports = router