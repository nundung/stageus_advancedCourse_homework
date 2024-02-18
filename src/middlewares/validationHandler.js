const { validationResult } = require('express-validator');

const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages =
            errors.array().map((error) => error.msg) || '필수항목을 모두 입력해주세요';

        const error = new Error(errorMessages);
        console.log(error.stack);
        error.status = 400;
        // 다음 에러 핸들링 미들웨어로 에러 전달
        return next(error);
    }
    next();
};

module.exports = { validationHandler };
