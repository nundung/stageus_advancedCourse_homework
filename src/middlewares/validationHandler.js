const { validationResult } = require('express-validator')

const validatorErrorChecker = (req, res, next) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg) || '필수항목을 모두 입력해주세요'
        res.status(400).json({ errors: errorMessages })
        const statusCode = err.status || 500    // 에러 객체에 status가 없을 경우 기본값으로 500 설정
        const errorMessage = err.message || '서버 오류가 발생했습니다.'
        const stackTrace = err.stack || null
        const error = {
            statusCode: statusCode,
            stackTrace: stackTrace
        }
    res.locals.error = error
    res.status(statusCode).json({ message: errorMessage })
    }

    next()
}

module.exports = {
    validatorErrorChecker
}