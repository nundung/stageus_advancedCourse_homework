//Import
const router = require("express").Router()
const { isAdmin } = require("../middlewares/isSession")
const controller = require("../controllers/adminController")


//로그목록 보기
router.get("/log/:sort?/:startdate?/:enddate?/:id?/:api?",
    isAdmin,
    controller.log
)

//유저목록 보기
router.get("/account/:sort?/:startdate?/:enddate?",
    isAdmin,
    controller.account
)

//댓글목록 보기
router.get("/commentlist/:sort/:startdate/:enddate/:id?",
isAdmin,
controller.log
)


module.exports = router