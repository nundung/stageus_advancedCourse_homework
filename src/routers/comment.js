//Import
const router = require("express").Router()
const pool = require("../database/postgreSql")
const exception = require("../modules/exception")
const sessionCheckMid = require("../middlewares/sessionCheckMid")
const controller = require("../controllers/commentController")
const  { validatorErrorChecker } = require("../middlewares/validatorMid")
const { check } = require("express-validator")


//Apis
//댓글 업로드
router.post(
    "/",
    sessionCheckMid.sessionCheck,
    check("comment").notEmpty().isLength({min: 1, max: 200}),
    validatorErrorChecker,
    controller.uploadComment
)

//댓글 보기
router.get(
    "/",
    sessionCheckMid.sessionCheck,
    controller.readComment
)

//댓글 수정
router.put(
    "/:commentidx",
    sessionCheckMid.sessionCheck,
    check("comment").notEmpty().isLength({min: 1, max: 200}),
    validatorErrorChecker,
    controller.editComment
    )

//댓글 삭제
router.delete(
    "/:commentidx",
    sessionCheckMid.sessionCheck,
    controller.deleteComment
)

module.exports = router