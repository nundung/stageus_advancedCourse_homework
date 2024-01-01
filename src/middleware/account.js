
const exception = require('../modules/exception')

const sessionCheck = (req, res, next) => {
    if (req.session.user) {
        const e = new Error("이미 로그인 되어있습니다.")
        e.status = 403
        return next(e)
    }
    next()
}


const idcheck = (req, res, next) => {
    const { id } = req.body;
    if(id === null || id === "" || id === undefined) {
        const e = new Error("아이디값이 이상해요")
        e.status = 400
        return next(e)
    }
    var idReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    if(!idReg.test(id)) {
        const e = new Error("아이디 형식 불일치")
        e.status = 400
        return next(e)
    }
    next()
}




module.exports = {sessionCheck, idcheck}


    //("아이디는 영문, 숫자의 조합으로 6~18자로 입력해주세요.");


    if(pw === null || pw === "" || pw === undefined) throw new Error("비밀번호 값이 이상해요")
    //비밀번호 정규식
    var pwReg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    if(!pwReg.test(pw)) throw new Error("비밀번호 형식 불일치")
    //("비밀번호는 영문, 숫자, 특수문자의 조합으로 8~20자로 입력해주세요.");

