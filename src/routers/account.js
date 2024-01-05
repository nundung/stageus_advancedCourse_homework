//Import
const router = require("express").Router()
const pool = require('../database/postgreSql')
const exception = require('../modules/exception')
const duplicate = require('../modules/duplicateCheck')
const controller = require("../controllers/accountController")
const middleware = require("../middlewares/accountMiddleware")

const { body, check} = require("express-validator")
const validator = require("../middlewares/validator") 
//Apis
//회원가입 & 아이디/이메일 중복체크
router.post(
    "/",
    middleware.sessionCheck,
    [
        check("id").isEmpty().withMessage("아이디를 입력해주세요."),
        check("pw").isEmpty().withMessage("비밀번호를 입력해주세요."),
        check("name").isEmpty().withMessage("이름을 입력해주세요."),
        check("email").isEmpty().withMessage("이메일을 입력해주세요."),
    ],
    validator.validatorErrorChecker,
    duplicate.idCheck,
    duplicate.emailCheck,
    controller.register
)


//로그인
router.post(
    "/login",
    middleware.sessionCheck,
    [
        check("id").isEmpty(),
        check("pw").isEmpty()
    ],
    validator.validatorErrorChecker,
    controller.logIn
)


//로그아웃
router.get(
    "/logout",
    middleware.sessionNotCheck,
    controller.logOut
)

//내정보 보기
router.get("/info", (req, res) => {
    const infoResult = {
        "message": "",
        "data": null
    }
    try {
        if (!req.session.user) {
            const e = new Error("세션에 사용자 정보 없음")
            e.status = 401     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
            throw e
        }
        const { id, pw, name, email } = req.session.user
        infoResult.data = {id, pw, name, email}
        res.status(200).send(infoResult)
    }
    catch (e) {
        infoResult.message = e.message
        res.status(400).send(infoResult)
    }
})

//내정보 수정
router.put("/info", async (req, res) => {
    const {pw, name, email} = req.body
    const editInfoResult = {
        "message": ""
    }
    try {
        if (!req.session.user) {
            const e = new Error("세션에 사용자 정보 없음")
            e.status = 401     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
            throw e
        }
        const idx = req.session.user.idx
        const currentemail = req.session.user.email
        exception.pwCheck(pw)
        exception.nameCheck(name)
        exception.emailCheck(email)

        //이메일 중복체크
        //이메일이 바뀌었을 때만 실행
        if (currentemail !== email) {
            console.log(currentemail, email)
            await duplicate.emailCheck(email)
        }

        const sql = "UPDATE account SET pw=$1, name=$2, email=$3 WHERE idx=$4"   //물음표 여러개면 $1, $2, $3
        const values = [pw, name, email, idx]
        const data = await pool.query(sql, values)

        if(data.rowCount === 0) throw new Error("정보수정 실패")
        req.session.user = {
            ...req.session.user,
            pw: pw,
            name: name,
            email: email
        }
        editInfoResult.message = "정보수정이 완료되었습니다."
    
        res.status(200).send(editInfoResult)
    }
    catch (e) {
        editInfoResult.message = e.message
        res.status(400).send(editInfoResult)
    }
})

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