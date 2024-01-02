
const exception = require('../modules/exception')

const sessionCheck = (req, res, next) => {
    if (req.session.user) {
        const e = new Error("이미 로그인 되어있습니다.")
        e.status = 403
        return next(e)
    }
    next()
}

const existCheck = (req, res, next) => {
    const { value } = req.body
    if(value === null || value === "" || value === undefined) {
        const e = new Error(`필수값을 모두 입력해주세요`)
        e.status = 400
        return next(e)
    }
    next()
}

const idCheck = (req, res, next) => {
    const { id } = req.body
    var idReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    if(!idReg.test(id)) {
        const e = new Error("아이디 형식 불일치")
        e.status = 400
        return next(e)
    }
    next()
}
//("아이디는 영문, 숫자의 조합으로 6~18자로 입력해주세요.");



const pwCheck = (req, res, next) => {
    const { pw } = req.body
    var pwReg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    if(!pwReg.test(pw)) {
        const e = new Error("비밀번호 형식 불일치")
        e.status = 400
        return next(e)
    }
    next()
}

    //("비밀번호는 영문, 숫자, 특수문자의 조합으로 8~20자로 입력해주세요.");

module.exports = {sessionCheck, idCheck, pwCheck, existCheck}
