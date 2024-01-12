// import
const { pool } = require('../databases/postgreSql')

//아이디 중복체크
const id = async (req, res, next) => {
    const { id } = req.body
    try {
        const sql = "SELECT * FROM account WHERE id=$1" //물음표 여러개면 $1, $2, $3
        const values = [id]
        const data = await pool.query(sql, values)

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
    const { email } = req.body

    const duplicateCheck = async () => {
        try {
            const sql = "SELECT * FROM account WHERE email=$1"
            const values = [email]
            const data = await pool.query(sql, values)

            if (data.rows.length > 0) {
                const e = new Error("이미 사용 중인 이메일입니다.")
                e.status = 409
                return next(e)
            }
            next()
        } 
        catch (err) {
            next(err)
        }
    }
    try {
        if (req.session.user) {
            const currentEmail = req.session.user.email
            if (email === currentEmail) {
                return next()
            } 
            await duplicateCheck()
        }
        else { await duplicateCheck() }
    }
    catch (err) {
        next(err)
    }
}


//전화번호 중복체크
const phonenumber = async (req, res, next) => {
    const { phonenumber } = req.body
    
    const duplicateCheck = async () => {
        try {
            const sql = "SELECT * FROM account WHERE phonenumber=$1" //물음표 여러개면 $1, $2, $3
            const values = [phonenumber]
            const data = await pool.query(sql, values)

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
    try {
        const authInfo = req.decoded
        const idx = authInfo.idx
        
        const sql = "SELECT phonenumber FROM account WHERE idx=$1"   //물음표 여러개면 $1, $2, $3
        const values = [idx]
        const data = await pool.query(sql, values)

        const currentPhonenumber = data.rows[0].phonenumber
        if(req.session.user) {
            if (phonenumber === currentPhonenumber) {
                return next()
            } 
            await duplicateCheck()
        }
        else { await duplicateCheck() }
    }
    catch (err) {
        next(err)
    }
}

module.exports = { id, email, phonenumber }
