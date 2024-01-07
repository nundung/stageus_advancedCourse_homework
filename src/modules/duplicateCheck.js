// import
const client = require('../database/postgreSql')
const duplicate = {}

//아이디 중복체크
duplicate.idCheck = async (req, res, next) => {
    try {
        const id = req.body.id
        const sql = "SELECT * FROM account WHERE id=$1" //물음표 여러개면 $1, $2, $3
        const values = [id]
        const data = await client.query(sql, values)

        if (data.rows.length > 0) {
            const e = new Error("이미 사용 중인 아이디입니다.")
            e.status = 409         //이미 존재하는 리소스에 대한 중복된 생성 요청
            return next(e)
        }
        next()
    }
    catch (err) {
        next(err)
    }
}

//이메일 중복체크
duplicate.emailCheck = async (req, res, next) => {
    try {
        const email = req.body.email
        const sql = "SELECT * FROM account WHERE email=$1" //물음표 여러개면 $1, $2, $3
        const values = [email]
        const data = await client.query(sql, values)

        if (data.rows.length > 0) {
            const e = new Error("이미 사용 중인 이메일입니다.")
            e.status = 409         //이미 존재하는 리소스에 대한 중복된 생성 요청
            throw e
        }
        next()
    }
    catch (err) {
        next(err)
    }
}

module.exports = duplicate;