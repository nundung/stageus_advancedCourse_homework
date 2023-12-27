// Import
const router = require("express").Router()
const client = require('../../psql')
const exception = require('../modules/exception')
const duplicate = require('../modules/duplicateCheck')

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
        //정규식 체크
        exception.idCheck(id)
        exception.pwCheck(pw)
        exception.nameCheck(name)
        exception.emailCheck(email)

        //중복체크
        duplicate.idCheck(id)
        duplicate.emailCheck(email)

        const idDuplicateMessage = await duplicate.idCheck(id);
        const emailDuplicateMessage = await duplicate.emailCheck(email);

        if (idDuplicateMessage) {
            // signUpResult.message = idDuplicateMessage;
            // return res.send(signUpResult);
            throw new Error(idDuplicateMessage)
        }

        if (emailDuplicateMessage) {
            // signUpResult.message = emailDuplicateMessage;
            // return res.send(signUpResult);
            throw new Error(emailDuplicateMessage)
        }

        //아이디/이메일 중복이 아닌 경우 회원가입
        const sql = "INSERT INTO account (id, pw, name, email) VALUES ($1, $2, $3, $4)" //물음표 여러개면 $1, $2, $3
        const values = [id, pw, name, email]
        const data = await client.query(sql, values)

        signUpResult.success = true
        signUpResult.message = "회원가입에 성공했습니다."
        // res.send(signUpResult)
    }
    catch (e) {
        signUpResult.message = e.message
        // res.send(signUpResult)
    }
    finally {
        if(client) client.end()      //끊어주지 않으면 언젠가 막힘 최대 접속 가능 개수를 넘으면 막힘 1000개까지 접속이 가능하기 때문에 1000개가 넘어가는 순간 막힘
        res.send(signUpResult)
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
        res.send(logInResult)
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
        await req.session.destroy(() => {
            if (err) return res.send(logOutResult)

            res.clearCookie('connect.sid')  // 세션 쿠키 삭제
            logOutResult.success = true
            res.send(logOutResult)
        })
    }
    catch (e) {
        logOutResult.message = e.message
        res.send(logOutResult)
    }
})

//내정보 보기
router.get("/info", (req, res) => {
    const infoResult = {
        "success": false,
        "message": "",
        "data": null
    }
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 존재하지 않습니다.")
        const { id, pw, name, email } = req.session.user
        infoResult.success = true
        infoResult.data = {id, pw, name, email}
        res.send(infoResult)
    }
    catch (e) {
        infoResult.message = e.message
        res.send(infoResult)
    }
})

//내정보 수정
router.put("/info", async (req, res) => {
    const {pw, name, email} = req.body
    const editInfoResult = {
        "success": false,
        "message": ""
    }
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
            duplicate.emailCheck(email)
            updateInfoEvent()
        }
        else updateInfoEvent()
        
        //정보 수정
        //바뀐사항 있을 때만 실행하도록 하자 (12/27)
        const updateInfoEvent = () => {
            conn.query('UPDATE account SET pw=?, name=?, email=? WHERE idx=?', [pw, name, email, idx], (err) => {
            if (err) return res.send(editInfoResult)
            req.session.user = {
                pw: pw,
                name: name,
                email: email
            }
            editInfoResult.success = true 
            editInfoResult.message = "정보수정이 완료되었습니다."
            res.send(editInfoResult)
            })
        }
    }
    catch (e) {
        editInfoResult.message = e.message
        res.send(editInfoResult)
    }
})


module.exports = router