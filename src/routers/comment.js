//Import
const router = require("express").Router()
const controller = require("../controllers/commentController")
const { isSession } = require("../middlewares/isSession")
const { validatorErrorChecker }  = require("../middlewares/validationHandler")
const { check } = require("express-validator")


//Apis
//댓글 업로드
router.post(
    "/",
    isSession,
    check("comment").notEmpty().isLength({min: 1, max: 200}),
    validatorErrorChecker,
    controller.uploadComment
)

//댓글 보기
router.get(
    "/",
    isSession,
    controller.readComment
)

//댓글 수정
router.put(
    "/:commentidx",
    isSession,
    check("comment").notEmpty().isLength({min: 1, max: 200}),
    validatorErrorChecker,
    controller.editComment
)

//댓글 삭제
router.delete(
    "/:commentidx",
    isSession,
    controller.deleteComment
)

module.exports = router