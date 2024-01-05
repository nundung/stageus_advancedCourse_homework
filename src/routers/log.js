//Import
const router = require("express").Router()
const schema = require("../database/mongoDb")

// 로그 모델 생성
const LogModel = schema.logModel

// 미들웨어 함수를 사용하여 API 호출 로깅
router.use((req, res, next) => {
    const logData = {
        ip: req.ip,
        id: req.userId, // 사용자 ID 또는 요청 ID 등
        url: req.originalUrl,
        method: req.method,
        requestedTimestamp: new Date(),
        respondedTimestamp: new Date(),
        status: '',
        stacktrace: ''
    }
    try {
    // LogModel에 저장
    LogModel.create(logData)
        .then(() => {
            // 로깅 성공
            next()
        })
        .catch((error) => {
            // 로깅 실패 처리
            console.error('로그 저장 실패:', error)
            next()   // 계속 진행
        })
    }
    catch (err) {
        next(err)
    }
})


module.exports = router