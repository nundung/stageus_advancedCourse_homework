//Import
const router = require("express").Router()
const controller = require("../controllers/postController")
const { validatorErrorChecker }  = require("../middlewares/validationHandler")
const { check } = require("express-validator")
const { isToken } = require("../middlewares/isToken")

//Apis
//게시물 목록(게시판)
router.get(
    "/",
    isToken,
    controller.postList
)

//게시글 업로드
router.post(
    "/",
    isToken,
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
    isToken,
    controller.readPost
)

//게시글 수정
router.put(
    "/:postidx",
    isToken,
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
    isToken,
    controller.deletePost
)


module.exports = router