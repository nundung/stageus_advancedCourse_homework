//Import
const router = require("express").Router()
const pool = require('../database/postgreSql')
const exception = require('../modules/exception')
const duplicate = require('../modules/duplicateCheck')
const controller = require("../controllers/accountController")
const middleware = require("../middlewares/accountMid")
const  { validatorErrorChecker } = require("../middlewares/validatorMid")
const { body, check} = require("express-validator")

//Apis
//회원가입 & 아이디/이메일 중복체크
router.post(
    "/",
    middleware.sessionNotCheck,
    [
        body("id").notEmpty().isLength({ min: 6, max: 18 }),
        body("pw").notEmpty().isLength({ min: 8, max: 20 }),
        body("name").notEmpty().isLength({ min: 2, max: 4 }),
        check("email").notEmpty().isEmail().withMessage('올바른 이메일 주소를 입력해주세요.')
    ],
    validatorErrorChecker,
    duplicate.idCheck,
    duplicate.emailCheck,
    controller.register
)


//로그인
router.post(
    "/login",
    middleware.sessionNotCheck,
    [
        body("id").notEmpty().isLength({ min: 6, max: 18 }),
        body("pw").notEmpty().isLength({ min: 8, max: 20 }),
    ],
    validatorErrorChecker,
    controller.logIn
)


//로그아웃
router.get(
    "/logout",
    middleware.sessionCheck,
    controller.logOut
)

//내정보 보기
router.get(
    "/info",
    middleware.sessionCheck,
    controller.info
    )

//내정보 수정
router.put(
    "/info",
    middleware.sessionCheck,
    [
        body("pw").notEmpty().isLength({ min: 8, max: 20 }),
        body("name").notEmpty().isLength({ min: 2, max: 4 }),
        check("email").notEmpty().isEmail().withMessage('올바른 이메일 주소를 입력해주세요.')
    ],
    validatorErrorChecker,
    middleware.emailChangeCheck,
    controller.editInfo
)

//계정 삭제
router.delete(
    "/",
    middleware.sessionCheck,
    controller.deleteAccount
)


module.exports = router