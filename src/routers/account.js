//Import
const router = require("express").Router()
const { check } = require("express-validator")
const { isSession, isNotSession } = require("../middlewares/isSession")
const { validatorErrorChecker }  = require("../middlewares/validationHandler")
const { idCheck, emailCheck, phonenumberCheck } = require('../middlewares/isDuplicate')
const controller = require("../controllers/accountController")

//Apis
//회원가입 & 아이디/이메일 중복체크
router.post(
    "/",
    isNotSession,
    [
        check("id").notEmpty().isLength({ min: 6, max: 18 }),
        check("pw").notEmpty().isLength({ min: 8, max: 20 }),
        check("name").notEmpty().isLength({ min: 2, max: 4 }),
        check("phonenumber").notEmpty().isLength({ min: 11, max: 13 }),
        check("email").notEmpty().isEmail().withMessage('올바른 이메일 주소를 입력해주세요.')
    ],
    validatorErrorChecker,
    idCheck,
    phonenumberCheck,
    emailCheck,
    controller.register
) 

//로그인
router.post(
    "/login",
    isNotSession,
    [
        check("id").notEmpty().isLength({ min: 6, max: 18 }),
        check("pw").notEmpty().isLength({ min: 8, max: 20 }),
    ],
    validatorErrorChecker,
    controller.logIn
)

//로그아웃
router.get(
    "/logout",
    isSession,
    controller.logOut
)

//내정보 보기
router.get(
    "/info",
    isSession,
    controller.info
    )

//내정보 수정
router.put(
    "/info",
    isSession,
    [
        check("pw").notEmpty().isLength({ min: 8, max: 20 }),
        check("name").notEmpty().isLength({ min: 2, max: 4 }),
        check("email").notEmpty().isEmail().withMessage('올바른 이메일 주소를 입력해주세요.')
    ],
    validatorErrorChecker,
    controller.editInfo
)

//계정 삭제
router.delete(
    "/",
    isSession,
    controller.deleteAccount
)


module.exports = router