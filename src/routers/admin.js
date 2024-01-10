//Import
const router = require("express").Router()
const { isAdmin } = require("../middlewares/isSession")
const controller = require("../controllers/adminController")


//로그 목록 보기
router.get("/log/:sort/:startdate/:enddate/:id?/:api?",
    isAdmin,
    controller.log
)

module.exports = router