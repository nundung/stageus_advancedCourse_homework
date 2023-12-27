// Import
const router = require("express").Router()
const client = require('../../psql')
const exception = require('../modules/exception')

//Apis
//회원가입 & 아이디/이메일 중복체크
router.post("/", async (req, res) => {
    const {id, pw, name, email} = req.body
    //백엔드에서 프론트로 보내줄 값 미리 생성
    const signUpResult = {
        "success": false,
        "message": "",
        "data": null
    }
    try {
        exception.idCheck(id)
        exception.pwCheck(pw)
        exception.nameCheck(name)
        exception.emailCheck(email)

        //아이디 중복체크
        const idCheckSql = "SELECT * FROM account WHERE id=$1" //물음표 여러개면 $1, $2, $3
        const idValues = [id]
        const idData = await client.query(idCheckSql, idValues)

        if (idData.rows.length > 0) {
            signUpResult.message = "아이디가 이미 존재합니다."
            return res.send(signUpResult); // 중복 아이디인 경우 바로 응답을 보내고 함수 종료
        }

        //이메일 중복체크
            const emailCheckSql = "SELECT * FROM account WHERE email=$1" //물음표 여러개면 $1, $2, $3
            const emailValues = [email]
            const emailData = await client.query(emailCheckSql, emailValues)

        if (emailData.rows.length > 0) {
            signUpResult.message = "이메일이 이미 존재합니다."
            return res.send(signUpResult); // 중복 아이디인 경우 바로 응답을 보내고 함수 종료
        }

        //아이디/이메일 중복이 아닌 경우 회원가입
        const signUpSql = "INSERT INTO account (id, pw, name, email) VALUES ($1, $2, $3, $4)" //물음표 여러개면 $1, $2, $3
        const signUpValues = [id, pw, name, email]
        const signUpData = await client.query(signUpSql, signUpValues)

        signUpResult.success = true
        signUpResult.message = "회원가입에 성공했습니다."
        res.send(signUpResult)
    }
    catch (e) {
        signUpResult.message = e
        res.send(signUpResult)
    }
    finally {
        if(client) client.end()      //끊어주지 않으면 언젠가 막힘 1000개까지 접속이 가능하기 때문에 1000개가 넘어가는 순간 막힘
    }
})

//로그인
router.post("/login", async (req, res) => {
    const {id, pw} = req.body
    const logInResult = {
        "success": false,
        "message": ""
    }
    try {
        if (req.session.user) throw new Error("이미 로그인 되어있습니다.")

        exception.idCheck(id)
        exception.pwCheck(pw)

        //db값 불러오기
        const sql = "SELECT * FROM account WHERE id=$1 AND pw=$2" //물음표 여러개면 $1, $2, $3
        const values = [id, pw]
        const data = await client.query(sql, values)

        if (data.rows.length === 0) {
            // 로그인 실패: 해당 아이디와 비밀번호로 계정을 찾을 수 없음
            logInResult.message = "아이디 또는 비밀번호가 올바르지 않습니다."
            return res.send(logInResult)
        }
        
        // 로그인 성공
        req.session.user = {
            idx: data.rows[0].idx,
            id: data.rows[0].id,
            pw: data.rows[0].pw,
            name: data.rows[0].name,
            email: data.rows[0].email
        }
        logInResult.success = true
        res.send(logInResult)
    }
    catch (e) {
        logInResult.message = e.message
        res.status(400).send(logInResult)
    }
    finally {
        if(client) client.end()      //끊어주지 않으면 언젠가 막힘 1000개까지 접속이 가능하기 때문에 1000개가 넘어가는 순간 막힘
    }
})

//로그아웃
router.get("/logout", async (req, res) => {
    const logOutResult = {
        "success": false,
        "message": ""
    }
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 존재하지 않습니다.")
        req.session.destroy((err) => {
            if (err) return res.send(logOutResult)
        
            res.clearCookie('connect.sid')  // 세션 쿠키 삭제
            logOutResult.success = true
            res.send(logOutResult)
        
        })
    }
    catch (e) {
        logOutResult.message = e.message
        res.status(400).send(logOutResult)
    }
})

module.exports = router