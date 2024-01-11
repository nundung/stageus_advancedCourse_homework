//Import
const router = require("express").Router()
const { body } = require("express-validator")
const { isSession, isNotSession } = require("../middlewares/isSession")
const { validatorErrorChecker }  = require("../middlewares/validationHandler")
const isDuplicate = require("../middlewares/isDuplicate")
const { validateId, validatePw, validateName, validatePhonenumber } = require("../middlewares/checkRegulation")
const controller = require("../controllers/accountController")
const { isToken } = require("../middlewares/isToken")

//Apis
//회원가입 & 아이디/이메일 중복체크
router.post(
    "/",
    isNotSession,
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

//토큰 확인
router.get("/token", isToken, async (req, res) => {
    const {id} = req.body
    const result = {
        "success": false,
        "data": null
    }
    const authInfo = req.decoded
    console.log(authInfo)

    try {
        if (id === null || id === "" || id === undefined) throw new Error("아이디 비어있음")
        console.log("api 진입함")

        const sql = "SELECT * FROM account WHERE id=$1"   //물음표 여러개면 $1, $2, $3
        const values = [id]
        const data = await pool.query(sql, values)

        const row = data.rows      //데이터베이스에서 가져온 값들 중 테이블 값만 저장
        result.success = true
        result.data = row
        res.send(result)
    }
    catch (err) {
        next(err)
        result.message = err.message
    }
})

//로그인
router.post(
    "/login",
    // isNotSession,
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

//로그아웃
router.get(
    "/logout",
    isToken,
    controller.logOut
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
    isSession,
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
    isSession,
    controller.deleteAccount
)


module.exports = router