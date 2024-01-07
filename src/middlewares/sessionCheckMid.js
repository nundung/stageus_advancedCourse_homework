
const sessionCheck = (req, res, next) => {
    if (!req.session.user) {
        const e = new Error("사용자 정보가 존재하지 않습니다.")
        e.status = 401
        throw e
    }
    next()
}

const sessionNotCheck = (req, res, next) => {
    if (req.session.user) {
        const e = new Error("이미 로그인 되어있습니다.")
        e.status = 403     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
        throw e
    }
    next()
}

module.exports = { sessionCheck, sessionNotCheck }