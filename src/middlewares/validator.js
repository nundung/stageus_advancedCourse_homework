const { validationResult } = require('express-validator')

const validatorErrorChecker = (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors)
        const e = new Error("필수 항목을 모두 입력해주세요.")
        e.status = 409 
        return next(e)
        }
        next()
    }
    catch (err) {
        next(err)
    }
}

module.exports = { validatorErrorChecker }