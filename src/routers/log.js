//Import
const { logModel } = require("../database/mongoDb")

// 미들웨어 함수를 사용하여 API 호출 로깅
router.use("/", async (req, res, next) => {
    
    // 여기서 logModel을 사용하여 로그를 MongoDB에 저장하는 작업을 수행
    const logData = {
        ip: req.ip,
        id: req.session.userId, 
        url: req.originalUrl,
        method: req.method,
        requestedTimestamp: new Date(),
        respondedTimestamp: null, 
        status:  null, 
        stacktrace: null // 예외가 발생했을 때 에러 스택 정보 기록
    }
    console.log("실행중")
    res.on('finish', async () => {
        logData.respondedTimestamp = new Date(); // 응답 시간을 현재 시간으로 설정
        logData.status = res.statusCode;
    // logData를 사용하여 logModel에 로그를 저장하는 작업 수행
        try {
            const log = await logModel.create(logData)
            console.log('로그가 성공적으로 저장되었습니다:', log)
        }
        catch (err) {
            next (err)
        }
    })
    next()
})


module.exports = router