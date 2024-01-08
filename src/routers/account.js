//Import
const router = require("express").Router()
const controller = require("../controllers/accountController")
const accountMid = require("../middlewares/accountMid")
const sessionCheckMid = require("../middlewares/sessionCheckMid")
const duplicateMid = require('../middlewares/duplicateCheckMid')
const  { validatorErrorChecker } = require("../middlewares/validatorMid")
const { check } = require("express-validator")

//Apis
//회원가입 & 아이디/이메일 중복체크
router.post(
    "/",
    sessionCheckMid.sessionNotCheck,
    [
        check("id").notEmpty().isLength({ min: 6, max: 18 }),
        check("pw").notEmpty().isLength({ min: 8, max: 20 }),
        check("name").notEmpty().isLength({ min: 2, max: 4 }),
        check("email").notEmpty().isEmail().withMessage('올바른 이메일 주소를 입력해주세요.')
    ],
    duplicateMid.idCheck,
    duplicateMid.emailCheck,
    validatorErrorChecker,
    controller.register
) 

//로그인
router.post(
    "/login",
    sessionCheckMid.sessionNotCheck,
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
    sessionCheckMid.sessionCheck,
    controller.logOut
)

//내정보 보기
router.get(
    "/info",
    sessionCheckMid.sessionCheck,
    controller.info
    )

//내정보 수정
router.put(
    "/info",
    sessionCheckMid.sessionCheck,
    [
        check("pw").notEmpty().isLength({ min: 8, max: 20 }),
        check("name").notEmpty().isLength({ min: 2, max: 4 }),
        check("email").notEmpty().isEmail().withMessage('올바른 이메일 주소를 입력해주세요.')
    ],
    validatorErrorChecker,
    accountMid.emailChangeCheck,
    controller.editInfo
)

//계정 삭제
router.delete(
    "/",
    sessionCheckMid.sessionCheck,
    controller.deleteAccount
)


module.exports = router