//Import
const router = require("express").Router()
const controller = require("../controllers/postController")
const { validateSort } = require("../middlewares/checkRegulation")
const { validationHandler }  = require("../middlewares/validationHandler")
const { check } = require("express-validator")
const { isToken } = require("../middlewares/isToken")

//Apis
//게시글 목록(게시판)
router.get(
    "/",
    isToken,
    controller.postList
)

//게시글 검색
router.get(
    "/search",
    isToken,
    [
        check("sort").custom((sort) => validateSort(sort)).withMessage("유효하지 않은 정렬형식"),
        check("title").notEmpty().isLength({ min: 1, max: 100}).withMessage("제목은 1~100자"),
    ],
    validationHandler,
    controller.searchPost
)

//최근 검색어 목록
router.get(
    "/search/recent",
    isToken,
    controller.searchList
)

//게시글 업로드
router.post(
    "/",
    isToken,
    [
        check("title").notEmpty().isLength({ min: 1, max: 100 }).withMessage("제목은 1~100자"),
        check("content").notEmpty().isLength({ min: 1, max: 1000 }).withMessage("본문은 1~1000자"),
    ],
    validationHandler,
    controller.uploadPost
)

const uploadImageServer = async (req, res, next) => {
    const { title, content } = req.body
    try {
        const authInfo = req.decoded
        const idx = authInfo.idx

        const sql = "INSERT INTO post(account_idx, title, content) VALUES ($1, $2, $3)"
        const values = [idx, title, content]
        await pool.query(sql, values)

        res.status(200).send()
    }
    catch (err) {
        next(err)
    }
}

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
        check("title").notEmpty().isLength({ min: 1, max: 100 }).withMessage("제목은 1~100자"),
        check("content").notEmpty().isLength({ min: 1, max: 1000 }).withMessage("본문은 1~1000자"),
    ],
    validationHandler,
    controller.editPost
)


//게시글 삭제
router.delete(
    "/:postidx",
    isToken,
    controller.deletePost
)


module.exports = router