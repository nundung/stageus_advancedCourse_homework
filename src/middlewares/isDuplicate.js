// import
const client = require('../databases/postgreSql')

//아이디 중복체크
const id = async (req, res, next) => {
    const { id } = req.body
    try {
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
const email = async (req, res, next) => {
    try {
        const email = req.body.email
        const sql = "SELECT * FROM account WHERE email=$1" //물음표 여러개면 $1, $2, $3
        const values = [email]
        const data = await client.query(sql, values)

        if (data.rows.length > 0) {
            const e = new Error("이미 사용 중인 이메일입니다.")
            e.status = 409         //이미 존재하는 리소스에 대한 중복된 생성 요청
            return next(e)
        }
        next()
    }
    catch (err) {
        next(err)
    }
}


//전화번호 중복체크
const phonenumber = async (req, res, next) => {
    try {
        const phonenumber = req.body.phonenumber
        const sql = "SELECT * FROM account WHERE phonenumber=$1" //물음표 여러개면 $1, $2, $3
        const values = [phonenumber]
        const data = await client.query(sql, values)

        if (data.rows.length > 0) {
            const e = new Error("이미 사용 중인 연락처입니다.")
            e.status = 409         //이미 존재하는 리소스에 대한 중복된 생성 요청
            throw e
        }
        next()
    }
    catch (err) {
        next(err)
    }
}

module.exports = { id, email, phonenumber }