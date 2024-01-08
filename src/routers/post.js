//Import
const router = require("express").Router()
const { isSession } = require("../middlewares/isSession")
const controller = require("../controllers/postController")
const { validatorErrorChecker }  = require("../middlewares/validationHandler")
const { check } = require("express-validator")

//Apis
//게시물 목록(게시판)
router.get(
    "/",
    isSession,
    controller.postList
)

//게시글 업로드
router.post(
    "/",
    isSession,
    [
        check("title").notEmpty().isLength({ min: 1, max: 100 }),
        check("content").notEmpty().isLength({ min: 1, max: 1000 }),
    ],
    validatorErrorChecker,
    controller.uploadPost
)

//게시글 보기
router.get(
    "/:postidx",
    isSession,
    controller.readPost
)

//게시글 수정
router.put(
    "/:postidx",
    isSession,
    [
        check("title").notEmpty().isLength({ min: 1, max: 100 }),
        check("content").notEmpty().isLength({ min: 1, max: 1000 }),
    ],
    validatorErrorChecker,
    controller.editPost
)


//게시글 삭제
router.delete(
    "/:postidx",
    isSession,
    controller.deletePost
)


module.exports = router