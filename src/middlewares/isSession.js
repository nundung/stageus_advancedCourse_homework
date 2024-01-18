
const isSession = (req, res, next) => {
    if (!req.session.user) {
        const err = new Error("사용자 정보가 존재하지 않습니다.")
        err.status = 401
        next(err)
    }
    next()
}

const isNotSession = (req, res, next) => {
    if (req.session.user) {
        const err = new Error("이미 로그인 되어있습니다.")
        err.status = 403     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
        next(err)
    }
    next()
}

const isAdmin = (req, res, next) => {
    const is_admin = req.session.user.is_admin
    if (!is_admin) {
        const err = new Error("접근 권한이 없습니다.")
        err.status = 401         //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다. (인증X)
        next(err)
    }
    next()
}

module.exports = { isSession, isNotSession, isAdmin }