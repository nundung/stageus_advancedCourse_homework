const pool = require('../database/connect');

const register = async (req, res, next) => {
    const {id, pw, name, email} = req.body
    const signUpResult = {"message": ""}
    try {
        const sql = "INSERT INTO account (id, pw, name, email) VALUES ($1, $2, $3, $4)" //물음표 여러개면 $1, $2, $3
        const values = [id, pw, name, email]
        const data = await pool.query(sql, values)

        res.status(201).send(signUpResult)
    }
    catch (e) {
        signUpResult.message = e.message
        const statusCode = e.status || 500; // 에러 객체에 status가 없을 경우 기본값으로 500 설정
        res.status(statusCode).send(signUpResult)
    }
}

const login = async (req, res) => {
    const {id, pw} = req.body
    const logInResult = {"message": ""}
    try {
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
}

module.exports = {register, login}