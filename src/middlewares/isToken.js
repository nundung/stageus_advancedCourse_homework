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
const haveToken =  async (req, res, next) => {
    console.log(req.session)
    if(req.session.token) {
        const token = req.session.token
        const err = new Error("이미 로그인 되어있습니다.")
        return next (err)
    }
    next()
}
// const haveToken =  async (req, res, next) => {
//     if(req.session && req.session.token) {
//         const token = req.session.token
//         console.log("이미 로그인 되어있습니다.")
//         const currentUserIdx = getUserIdxFromToken(req.session.token); // 토큰에서 사용자 인덱스 추출
//             const user = await getUserFromDatabase(currentUserIdx); // 사용자 정보를 데이터베이스에서 가져옴

//             //여기에서 user에는 사용자 정보가 담겨있어야 함

//             if (!user) {
//                 // 사용자 정보를 찾을 수 없는 경우 로그인 상태를 해제하고 다음 미들웨어로 진행
//                 req.session.destroy();
//                 return next();
//             }

//             // 여기에서 user.devices에는 사용자가 로그인한 기기 목록이 담겨있어야 함
//             const userDevices = user.devices;

//             next()
//     }
// }
module.exports = { isToken , isAdmin, haveToken}