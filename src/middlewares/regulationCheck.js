// import 
const exception = {}

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


// ("아이디는 영문, 숫자의 조합")
exception.idCheck = (id) => {
    const idReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{0,}$/
    if(!idReg.test(id)) throw new Error("아이디 형식 불일치")
}

//("비밀번호는 영문, 숫자, 특수문자의 조합")
exception.pwCheck = (pw) => {
    const pwReg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{0,}$/
    if(!pwReg.test(pw)) throw new Error("비밀번호 형식 불일치")
}

//("이름은 한글 혹은 영어로 입력")  
exception.nameCheck = (name) => {
    const nameReg = /^([가-힣]{0,}|[a-zA-Z]{0,})$/
    if(!nameReg.test(name)) throw new Error("이름 형식 불일치")
}

exception.phonenumberCheck = (phonenumber) => {
    const phonenumberReg = "01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})"
    if(!phonenumberReg.test(phonenumber)) throw new Error("전화번호 형식 불일치")
}

exception.emailCheck = (email) => {
    var emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{0,}$/i
    if(!emailReg.test(email)) throw new Error("이메일 형식 불일치")
}


module.exports = exception;
