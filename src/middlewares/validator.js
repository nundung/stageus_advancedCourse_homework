const { validationResult } = require('express-validator')
const validator = require('validator')

const validatorErrorChecker = (req, res, next) => {
    try {
        const errors = validationResult(req)
        console.log(errors)
        if (!errors.isEmpty()) {
            const e = new Error("필수 항목을 모두 입력해주세요.")
            e.status = 409 
            return next(e)
        }
        const { email } = req.body;
        if (!validator.isEmail(email)) {
            const e = new Error("유효한 이메일 주소를 입력해주세요.")
            e.status = 409
            e.type = 'invalidEmail'
            return next(e)
        }
        next()
    }
    catch (err) {
        next(err)
    }
}

module.exports = { validatorErrorChecker }