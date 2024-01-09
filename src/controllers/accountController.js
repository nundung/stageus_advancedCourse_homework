const pool = require('../databases/postgreSql')
const { phonenumberCheck } = require('../middlewares/regulationCheck')

//회원가입
const register = async (req, res, next) => {
    const { id, pw, name, email, phonenumber } = req.body
    try {
        const sql = "INSERT INTO account (id, pw, name, email, phonenumber) VALUES ($1, $2, $3, $4, $5)" //물음표 여러개면 $1, $2, $3
        const values = [id, pw, name, email, phonenumber ]
        await pool.query(sql, values)

        res.status(201).send()
    }
    catch (err) {
        next(err)
    }
}

//로그인
const logIn = async (req, res, next) => {
    const { id, pw } = req.body
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
            email: data.rows[0].email,
            is_admin: data.rows[0].is_admin
        }
        console.log(req.session.user.idx)
        res.status(200).send()
    }
    catch (err) {
        next(err)
    }
}

//로그아웃
const logOut = async (req, res, next) => {
    try {
        req.session.destroy() 
        res.clearCookie('connect.sid')  // 세션 쿠키 삭제
        res.status(200).send()
    }
    catch (err) {
        next(err)
    }
}

//내정보 보기
const info = (req, res, next) => {
    const result = { "data": null }
    try {
        const { id, pw, name, email } = req.session.user
        result.data = {id, pw, name, email}
        res.status(200).send(result)
    }
    catch (err) {
        next(err)
    }
}

//내정보 수정
const editInfo = async (req, res, next) => {
    const {pw, name, email} = req.body

    const emailChangeCheck = async (req, res, next) => {
        const newEmail = req.body.email
        try {
            const currentEmail = req.session.user.email
            if (newEmail !== currentEmail) {
                duplicate.emailCheck
            }
            next()
        }
        catch (err) {
            return next(err)
        }
    }
    try {
        const idx = req.session.user.idx

        const sql = "UPDATE account SET pw=$1, name=$2, email=$3 WHERE idx=$4"   //물음표 여러개면 $1, $2, $3
        const values = [pw, name, email, idx]
        data = await pool.query(sql, values)

        req.session.user = {
            ...req.session.user,
            pw: pw,
            name: name,
            email: email
        }
        res.status(200).send()
    }
    catch (err) {
        next(err)
    }
}

//계정 삭제
const deleteAccount = async (req, res, next) => {
    try {
        const idx = req.session.user.idx;

        const sql = "DELETE FROM account WHERE idx=$1"
        const values = [idx]
        data = await pool.query(sql, values)

        req.session.destroy() 
        res.clearCookie('connect.sid')  // 세션 쿠키 삭제

        res.status(200).send()
    }
    catch (err) {
        next(err)
    }
}

module.exports = { register, logIn, logOut, info, editInfo, deleteAccount }