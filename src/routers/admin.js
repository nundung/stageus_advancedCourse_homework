//Import
const router = require("express").Router()
const controller = require("../controllers/adminController")
const { check } = require("express-validator")
const { isToken, isAdmin } = require("../middlewares/isToken")
const { validationHandler }  = require("../middlewares/validationHandler")
const { validateSort, validateId, validateDate, validateApi } = require("../middlewares/checkRegulation")



//로그목록 보기
router.get("/log",
    isToken,
    isAdmin,
    [
        check("sort").custom((sort) => validateSort(sort)).withMessage("유효하지 않은 정렬형식"),
        check("id").custom((id) => validateId(id)).withMessage("유효하지 않은 아이디형식"),
        check("startdate").custom((startdate) => validateDate(startdate)).withMessage("유효하지 않은 날짜형식"),
        check("enddate").custom((enddate) => validateDate(enddate)).withMessage("유효하지 않은 날짜형식"),
        check("api").custom((api) => validateApi(api)).withMessage("유효하지 않은 api형식")
    ],
    validationHandler,
    controller.log
)

//유저목록 보기
router.get("/account",
    isToken,
    isAdmin,
    [
        check("sort").custom((sort) => validateSort(sort)).withMessage("유효하지 않은 정렬형식"),
        check("startdate").custom((startdate) => validateDate(startdate)).withMessage("유효하지 않은 날짜형식"),
        check("enddate").custom((enddate) => validateDate(enddate)).withMessage("유효하지 않은 날짜형식"),
    ],
    validationHandler,
    controller.account
)

//댓글목록 보기
router.get("/comment",
    isToken,
    isAdmin,
    [
        check("sort").custom((sort) => validateSort(sort)).withMessage("유효하지 않은 정렬형식"),
        check("startdate").custom((startdate) => validateDate(startdate)).withMessage("유효하지 않은 날짜형식"),
        check("enddate").custom((enddate) => validateDate(enddate)).withMessage("유효하지 않은 날짜형식"),
    ],
    validationHandler,
    controller.comment
)


module.exports = router