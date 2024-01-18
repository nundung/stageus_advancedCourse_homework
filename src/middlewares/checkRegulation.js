//정규식
const idReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/
const pwReg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/
const nameReg = /^([가-힣]{2,10}|[a-zA-Z]{2,10})$/
const phonenumberReg = /^01[0-9]{1}-?[0-9]{3,4}-?[0-9]{4}$/ 
const dateReg = /^(\d{4})-(\d{2})-(\d{2})$/


//아이디는 영문, 숫자의 조합
const validateId = (id) => {
    if (id) {
        return idReg.test(id)
    }
}

//비밀번호는 영문, 숫자, 특수문자의 조합
const validatePw = (pw) => {
    return pwReg.test(pw)
}

//("이름은 한글 혹은 영어로 입력")  
const validateName = (name) => {
    return nameReg.test(name)
}

//전화번호 형식
const validatePhonenumber = (phonenumber) => {
    return phonenumberReg.test(phonenumber)
}

//정렬은 desc 혹은 asc
// const validateSort = (sort) => {
//     if(sort !== "desc" || sort !== "asc") {

//     }
// }

//날짜 형식은 2000-01-01
const validateDate = (date) => {
    if (date) {
        return dateReg.test(date)
    }
    return true
}

// api
const validateApi = (api) => {
    if (!api) {
        return true
    }
    if(api === "account" || api === "post" || api === "comment" || api === "admin" || api === "visitor") {
        return true
    }
    return false
}

// const filter = (date) => {

// }


// exception.emailCheck = (email) => {
//     var emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{0,}$/i
//     if(!emailReg.test(email)) throw new Error("이메일 형식 불일치")
// }


module.exports = { 
    validateId,
    validatePw,
    validateName,
    validatePhonenumber,
    validateDate,
    validateApi
}
