const pool = require('../database/postgreSql')

const register = async (req, res, next) => {
    const {id, pw, name, email} = req.body
    try {
        const sql = "INSERT INTO account (id, pw, name, email) VALUES ($1, $2, $3, $4)" //물음표 여러개면 $1, $2, $3
        const values = [id, pw, name, email]
        await pool.query(sql, values)
        res.status(201).send({"message": "Success"})
    }
    catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    const {id, pw} = req.body
    try {
        const sql = "SELECT * FROM account WHERE id=$1 AND pw=$2"   //물음표 여러개면 $1, $2, $3
        const values = [id, pw]
        const data = await pool.query(sql, values)

        if (data.rowCount === 0) {
            const err = new Error("아이디 또는 비밀번호가 올바르지 않습니다.")
            err.status = 401         //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다. (인증X)
            return next(err)
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
        res.status(200).send({"message": "Success"})
    }
    catch (err) {
        next(err)
    }
}

module.exports = {register, login}