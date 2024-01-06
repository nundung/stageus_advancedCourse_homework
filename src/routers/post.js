//Import
const router = require("express").Router()
const pool = require('../database/postgreSql')
const exception = require('../modules/exception')
const postMid = require("../middlewares/postMid")
const sessionCheckMid = require("../middlewares/sessionCheckMid")
const controller = require("../controllers/postController")
const  { validatorErrorChecker } = require("../middlewares/validatorMid")
const { check } = require("express-validator")

//Apis
//게시물 목록(게시판)
router.get(
    "/",
    sessionCheckMid.sessionCheck,
    controller.postList
)

//게시글 업로드
router.post(
    "/",
    sessionCheckMid.sessionCheck,
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
    sessionCheckMid.sessionCheck,
    controller.readPost
)

//게시글 수정
router.put(
    "/:postidx",
    sessionCheckMid.sessionCheck,
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
    sessionCheckMid.sessionCheck,
    controller.deletePost
)


module.exports = router