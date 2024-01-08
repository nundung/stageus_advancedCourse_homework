//후처리

const errorHandling = (err, req, res, next) => {
    const statusCode = err.status || 500    // 에러 객체에 status가 없을 경우 기본값으로 500 설정
    const errorMessage = err.message || '서버 오류가 발생했습니다.'
    const stackTrace = err.stack || null
    
    res.status(statusCode).json({
        message: errorMessage
    })

    const logError = {
        message: errorMessage,
        statusCode: statusCode,
        stackTrace: stackTrace
    }
    
    res.locals.error = logError
    console.log("순서1")
    next()
}

module.exports = { errorHandling }