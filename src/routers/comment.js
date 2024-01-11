//Import
const router = require("express").Router()
const controller = require("../controllers/commentController")
const { validatorErrorChecker }  = require("../middlewares/validationHandler")
const { check } = require("express-validator")
const { isToken } = require("../middlewares/isToken")


//Apis
//댓글 업로드
router.post(
    "/",
    isToken,
    check("comment").notEmpty().isLength({min: 1, max: 200}),
    validatorErrorChecker,
    controller.uploadComment
)

//댓글 보기
router.get(
    "/",
    isToken,
    controller.readComment
)

//댓글 수정
router.put(
    "/:commentidx",
    isToken,
    check("comment").notEmpty().isLength({min: 1, max: 200}),
    validatorErrorChecker,
    controller.editComment
)

//댓글 삭제
router.delete(
    "/:commentidx",
    isToken,
    controller.deleteComment
)

module.exports = router