const jwt = require("jsonwebtoken")
const { pool } = require("../databases/postgreSql")

const isToken = (req, res, next) => {
    const { authorization } = req.headers
    const result = {
        "message": "",
    }
    try {
        if (!authorization || authorization.trim() === "") {
            result.message = "Authorization 헤더가 필요합니다."
            return res.status(401).send(result);
        }

        const token = authorization.split(" ")[1]
        //barear token 이라서 분리해줌

        if (!token || token == "{{token}}") {
            const e = new Error("no token")
            e.status = 409
            throw e
        }

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
            result.message = "로그인이 만료되었습니다."
        }
        else if (err.message === "invalid token") {
            result.message = "유효하지 않은 토큰"
        }
        else if (err.message === "jwt malformed") {
            result.message = "토큰 형식 잘못 됨"
        }
        res.send(result)
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const authInfo = req.decoded
        const isAdmin = authInfo.isAdmin

        if (isAdmin === false) {
            const err = new Error("접근 권한이 없습니다.")
            err.status = 401         //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다. (인증X)
            next(err)
        }
        next()
    }
    catch (err) {
        next (err)
    }
}


module.exports = { isToken , isAdmin }