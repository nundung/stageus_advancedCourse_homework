
const exception = require('../modules/exception')
const duplicate = require('../modules/duplicateCheck')

const sessionCheck = (req, res, next) => {
    if (req.session.user) {
        const e = new Error("이미 로그인 되어있습니다.")
        e.status = 401     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
        throw e
    }
    next()
}

const sessionNotCheck = (req, res, next) => {
    if (!req.session.user) {
        const e = new Error("사용자 정보가 존재하지 않습니다.")
        e.status = 403
        throw e
    }
    next()
}

// const existCheck = (req, res, next) => {
//     const { value } = req.body
//     if(value === null || value === "" || value === undefined) {
//         const e = new Error("필수값을 모두 입력해주세요.")
//         e.status = 400
//         return next(e)
//     }
//     next()
// }

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
        const currentEmail = req.session.user.email
    
        if (newEmail !== currentEmail) {
            try {
                await duplicate.emailCheck(req, res, next);
            } catch (err) {
                return next(err);
            }
        }
        next();
    };

module.exports = { sessionCheck, sessionNotCheck, idCheck, pwCheck, emailChangeCheck }
