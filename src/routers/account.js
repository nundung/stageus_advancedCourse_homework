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
    const client = await pool.connect()
    try {
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
        const data = await client.query(sql, values)

        if (data.rowCount === 0) throw new Error ("회원가입 실패")

        res.status(200).send(signUpResult)
    }
    catch (e) {
        signUpResult.message = e.message
        res.status(400).send(signUpResult)
    }
    finally {
        if(pool) pool.release()     //끊어주지 않으면 언젠가 막힘 최대 접속 가능 개수를 넘으면 막힘 1000개까지 접속이 가능하기 때문에 1000개가 넘어가는 순간 막힘
    }
})

//로그인
router.post("/login", async (req, res) => {
    const {id, pw} = req.body
    const logInResult = {
        "message": ""
    }
    const client = await pool.connect()
    try {
        if (req.session.user) throw new Error("이미 로그인 되어있습니다.")

        exception.idCheck(id)
        exception.pwCheck(pw)

        //db값 불러오기
        const sql = "SELECT * FROM account WHERE id=$1 AND pw=$2"   //물음표 여러개면 $1, $2, $3
        const values = [id, pw]
        const data = await client.query(sql, values)

        if (data.rowCount === 0) throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.")

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
        res.status(400).send(logInResult)
    }
    finally {
        if(client) client.release()     //끊어주지 않으면 언젠가 막힘 1000개까지 접속이 가능하기 때문에 1000개가 넘어가는 순간 막힘
    }
})

//로그아웃
router.get("/logout", async (req, res) => {
    const logOutResult = {
        "message": ""
    }
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 존재하지 않습니다.")
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
        if (!req.session.user) throw new Error("세션에 사용자 정보가 존재하지 않습니다.")
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
        "success": false,
        "message": ""
    }
    const client = await pool.connect()
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 존재하지 않습니다.");
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
        const data = await client.query(sql, values)

        if (data.rowCount > 0) {
            req.session.user = {
                pw: pw,
                name: name,
                email: email
            }
            res.status(200).send(editInfoResult)
            editInfoResult.message = "정보수정이 완료되었습니다."
        }
        else {
            res.status(200).send(editInfoResult)
            editInfoResult.message = "변경된 내용이 없습니다."
        }
    }
    catch (e) {
        editInfoResult.message = e.message
        res.status(400).send(editInfoResult)
    }
    finally {
        if(client) client.release()
        res.send(editInfoResult)
    }
})


module.exports = router