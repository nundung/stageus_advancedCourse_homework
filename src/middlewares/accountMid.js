//Import
const duplicate = require('./duplicateCheckMid')

const idCheck = (req, res, next) => {
    const { id } = req.body
    var idReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    if(!idReg.test(id)) {
        const e = new Error("아이디 형식 불일치")
        e.status = 400
        return next(err)
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
        return next(err)
    }
    next()
}
//("비밀번호는 영문, 숫자, 특수문자의 조합으로 8~20자로 입력해주세요.");


const emailChangeCheck = async (req, res, next) => {
    const newEmail = req.body.email
    try {
        const currentEmail = req.session.user.email
        if (newEmail !== currentEmail) {
            duplicate.emailCheck
        }
        next()
    }
    catch (err) {
        return next(err)
    }
}
module.exports = { idCheck, pwCheck, emailChangeCheck }
