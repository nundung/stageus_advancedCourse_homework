const jwt = require("jsonwebtoken")

const isToken = (req, res, next) => {
    const { token } = req.headers
    const result = {
        "success": false,
        "message": "",
    }
    try {
        if (!token || token === "") {
            throw new Error("no token")
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
            result.message = "토큰이 만료되었습니다."
        }
        else if (err.message === "invalid token") {
            result.message = "유효하지 않은 토큰"
        }
        res.send(result)
    }
}

module.exports = { isToken }