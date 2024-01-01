//Import
const router = require("express").Router()
const pool = require('../../psql')
const exception = require('../modules/exception')
const duplicate = require('../modules/duplicateCheck')

//Apis
//회원가입 & 아이디/이메일 중복체크
router.post("/", async (req, res) => {
    const {id, pw, name, email} = req.body
    const signUpResult = {
        "message": ""
    }
    try {
        if (req.session.user) {
            const e = new Error("이미 로그인 되어있습니다.")
            e.status = 403         //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
            throw e
        }
        //정규식 체크
        exception.idCheck(id)
        exception.pwCheck(pw)
        exception.nameCheck(name)
        exception.emailCheck(email)

        //중복체크
        await duplicate.idCheck(id)
        await duplicate.emailCheck(email)

        //아이디/이메일 중복이 아닌 경우 회원가입
        const sql = "INSERT INTO account (id, pw, name, email) VALUES ($1, $2, $3, $4)" //물음표 여러개면 $1, $2, $3
        const values = [id, pw, name, email]
        const data = await pool.query(sql, values)

        res.status(201).send(signUpResult)
    }
    catch (e) {
        signUpResult.message = e.message
        const statusCode = e.status || 500 // 에러 객체에 status가 없을 경우 기본값으로 500 설정
        res.status(statusCode).send(signUpResult)
    }
})

//로그인
router.post("/login", async (req, res) => {
    const {id, pw} = req.body
    const logInResult = {
        "message": ""
    }
    try {
        if (req.session.user) {
            const e = new Error("이미 로그인 되어있습니다.")
            e.status = 403     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
            // (401이랑 다르게 서버는 클라이언트가 누구인지 알고 있음)
            throw e
        }
        exception.idCheck(id)
        exception.pwCheck(pw)

        //db값 불러오기
        const sql = "SELECT * FROM account WHERE id=$1 AND pw=$2"   //물음표 여러개면 $1, $2, $3
        const values = [id, pw]
        const data = await pool.query(sql, values)

        if (data.rowCount === 0) {
            const e = new Error("아이디 또는 비밀번호가 올바르지 않습니다.")
            e.status = 401         //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다. (인증X)
            throw e
        }

        // 로그인 성공
        req.session.user = {
            idx: data.rows[0].idx,
            id: data.rows[0].id,
            pw: data.rows[0].pw,
            name: data.rows[0].name,
            email: data.rows[0].email
        }
        console.log(req.session.user.idx)
        res.status(200).send(logInResult)
    }
    catch (e) {
        logInResult.message = e.message
        const statusCode = e.status || 500; // 에러 객체에 status가 없을 경우 기본값으로 500 설정
        res.status(statusCode).send(logInResult)
    }
})

//로그아웃
router.get("/logout", async (req, res) => {
    const logOutResult = {
        "message": ""
    }
    try {
        if (!req.session.user) {
            const e = new Error("세션에 사용자 정보 없음")
            e.status = 401     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
            throw e
        }
        req.session.destroy() 
        res.clearCookie('connect.sid')  // 세션 쿠키 삭제
        res.status(200).send(logOutResult)
    }
    catch (e) {
        logOutResult.message = e.message
        res.status(400).send(logOutResult)
    }
})

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