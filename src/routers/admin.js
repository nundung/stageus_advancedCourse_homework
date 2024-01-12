//Import
const router = require("express").Router()
const controller = require("../controllers/adminController")
const { isToken, isAdmin } = require("../middlewares/isToken")


//로그목록 보기
router.get("/log",
    isToken,
    isAdmin,
    controller.log
)

//유저목록 보기
router.get("/account",
    isToken,
    isAdmin,
    controller.account
)

//댓글목록 보기
router.get("/comment",
    isToken,
    isAdmin,
    controller.comment
)


module.exports = router