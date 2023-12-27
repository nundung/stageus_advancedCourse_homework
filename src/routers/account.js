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
    }
    catch (e) {
        signUpResult.message = e
        res.send(signUpResult)
    }
    finally {
        if(client) client.end()      //끊어주지 않으면 언젠가 막힘 1000개까지 접속이 가능하기 때문에 1000개가 넘어가는 순간 막힘
    }
})


module.exports = router