const jwt = require("jsonwebtoken")
const { pool } = require("../databases/postgreSql")

const isToken = (req, res, next) => {
    const { authorization } = req.headers
    const result = {
        "message": "",
    }
    try {
        if (!authorization || authorization === "") {
            throw new Error("no token")
        }
        
        const token = authorization.split(" ")[1];
        req.decoded = jwt.verify(token, process.env.SECRET_KEY)
        //이 명령어의 반환값이 바로 token에 있는 payload로 변환한 것
        next()
    }
    catch(err) {
        console.log(err.message)
        if (err.message === "no token") {
            result.message = "로그인이 필요합니다."
        }
        else if (err.message === "jwt expired") {
            result.message = "토큰이 만료되었습니다."
        }
        else if (err.message === "invalid token") {
            result.message = "유효하지 않은 토큰"
        }
        res.send(result)
    }
}

const isAdmin = async (req, res, next) => {
    const authInfo = req.decoded
    const idx = authInfo.idx
    
    const sql = "SELECT is_admin FROM account WHERE idx=$1"   //물음표 여러개면 $1, $2, $3
    const values = [idx]
    const data = await pool.query(sql, values)

    const isAdmin = data.rows[0].is_admin
    if (isAdmin === false) {
        const err = new Error("접근 권한이 없습니다.")
        err.status = 401         //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다. (인증X)
        next(err)
    }
    next()
}


module.exports = { isToken , isAdmin }