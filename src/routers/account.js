//Import
const router = require("express").Router()
const { body } = require("express-validator")
const isDuplicate = require("../middlewares/isDuplicate")
const { validatorErrorChecker }  = require("../middlewares/validationHandler")
const { validateId, validatePw, validateName, validatePhonenumber } = require("../middlewares/checkRegulation")
const controller = require("../controllers/accountController")
const { isToken } = require("../middlewares/isToken")

//Apis
//회원가입 & 아이디/이메일 중복체크
router.post(
    "/",
    [
        body("id").notEmpty().withMessage("아이디 없음").
        if(body("id").notEmpty()).
        custom((id) => validateId(id)).withMessage("유효하지 않은 아이디"),

        body("pw").notEmpty().withMessage("비밀번호 없음").
        if(body("pw").notEmpty()).
        custom((pw) => validatePw(pw)).withMessage("유효하지 않은 비밀번호"),

        body("name").notEmpty().withMessage("이름 없음").
        if(body("name").notEmpty()).
        custom((name) => validateName(name)).withMessage("유효하지 않은 이름"),

        body("phonenumber").notEmpty().withMessage("전화번호 없음").
        if(body("phonenumber").notEmpty()).
        custom((phonenumber) => validatePhonenumber(phonenumber)).withMessage("유효하지 않은 전화번호"),

        body("email").notEmpty().withMessage("이메일 없음").
        if(body("email").notEmpty()).
        isEmail().withMessage("유효하지 않은 이메일")
    ],
    validatorErrorChecker,
    isDuplicate.id,
    isDuplicate.email,
    isDuplicate.phonenumber,
    controller.register
) 

//로그인
router.post(
    "/login",
    [
        body("id").notEmpty().withMessage("아이디값 없음").
        if(body("id").notEmpty()).
        custom((id) => validateId(id)).withMessage("유효하지 않은 아이디"),

        body("pw").notEmpty().withMessage("비밀번호값 없음").
        if(body("pw").notEmpty()).
        custom((pw) => validatePw(pw)).withMessage("유효하지 않은 비밀번호")
    ],
    validatorErrorChecker,
    controller.logIn
)

//내정보 보기
router.get(
    "/info",
    isToken,
    controller.info
)

//내정보 수정
router.put(
    "/info",
    isToken,
    [
        body("pw").notEmpty().withMessage("비밀번호값 없음").
        if(body("pw").notEmpty()).
        custom((pw) => validatePw(pw)).withMessage("유효하지 않은 비밀번호"),

        body("name").notEmpty().withMessage("이름값 없음").
        if(body("name").notEmpty()).
        custom((name) => validateName(name)).withMessage("유효하지 않은 이름"),

        body("phonenumber").notEmpty().withMessage("전화번호값 없음").
        if(body("phonenumber").notEmpty()).
        custom((phonenumber) => validatePhonenumber(phonenumber)).withMessage("유효하지 않은 전화번호"),

        body("email").notEmpty().withMessage("이메일값 없음").
        if(body("email").notEmpty()).
        isEmail().withMessage("유효하지 않은 이메일")
    ],
    validatorErrorChecker,
    isDuplicate.email,
    isDuplicate.phonenumber,
    controller.editInfo
)

//계정 삭제
router.delete(
    "/",
    isToken,
    controller.deleteAccount
)


module.exports = router