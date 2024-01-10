//아이디는 영문, 숫자의 조합
const validateId = (id) => {
    console.log(id)
    const idReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/
    return idReg.test(id)
}

//비밀번호는 영문, 숫자, 특수문자의 조합
const validatePw = (pw) => {
    console.log(pw)
    const pwReg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/
    return pwReg.test(pw)
}

//("이름은 한글 혹은 영어로 입력")  
const validateName = (name) => {
    const nameReg = /^([가-힣]{0,}|[a-zA-Z]{2,10})$/
    return nameReg.test(name)
}

const validatePhonenumber = (phonenumber) => {
    const phonenumberReg = /^01[0-9]{1}-?[0-9]{3,4}-?[0-9]{4}$/
    return phonenumberReg.test(phonenumber)
}

// exception.emailCheck = (email) => {
//     var emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{0,}$/i
//     if(!emailReg.test(email)) throw new Error("이메일 형식 불일치")
// }


module.exports = { validateId, validatePw, validateName, validatePhonenumber }
