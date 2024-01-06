//Import
const router = require("express").Router()
const pool = require('../database/postgreSql')
const exception = require('../modules/exception')
const duplicate = require('../modules/duplicateCheck')
const controller = require("../controllers/accountController")
const middleware = require("../middlewares/accountMiddleware")
const  { validatorErrorChecker } = require("../middlewares/validator")
const { body, check} = require("express-validator")

//Apis
//회원가입 & 아이디/이메일 중복체크
router.post(
    "/",
    middleware.sessionCheck,
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
    middleware.sessionCheck,
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
    middleware.sessionNotCheck,
    controller.logOut
)

//내정보 보기
router.get(
    "/info",
    middleware.sessionNotCheck,
    controller.info
    )

//내정보 수정
router.put(
    "/info",
    middleware.sessionNotCheck,
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
router.delete("/", async (req, res) => {
    const deleteAccountResult = {
        "message": ""
    }
    try {
        if (!req.session.user) {
            const e = new Error("세션에 사용자 정보 없음")
            e.status = 401     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
            throw e
        }
        const idx = req.session.user.idx;

        const sql = "DELETE FROM account WHERE idx=$1"
        const values = [idx]
        const data = await pool.query(sql, values)

        if (data.rowCount === 0) throw new Error ("회원탈퇴 실패")

        req.session.destroy() 
        res.clearCookie('connect.sid')  // 세션 쿠키 삭제

        deleteAccountResult.message = "회원탈퇴가 완료되었습니다."
        res.status(200).send(deleteAccountResult)
        
    }
    catch (e) {
        deleteAccountResult.message = e.message
        res.status(400).send(deleteAccountResult)
    }
})


module.exports = router