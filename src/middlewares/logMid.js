//Import
const { logModel } = require("../database/mongoDb")

const logging = async (req, res, next) => {
    // 여기서 logModel을 사용하여 로그를 MongoDB에 저장하는 작업을 수행
    const logData = {
        ip: req.ip,
        id: req.session.user ? req.session.user.id : 'unknown', 
        url: req.originalUrl,
        method: req.method,
        requestedTimestamp: new Date(),
        respondedTimestamp: null, 
        status:  null, 
        stacktrace: null // 예외가 발생했을 때 에러 스택 정보 기록
    }
    res.on('finish', async () => {
        logData.respondedTimestamp = new Date() // 응답 시간을 현재 시간으로 설정
        logData.status = res.statusCode
        try {
            const log = await logModel.create(logData)
            console.log('로그가 성공적으로 저장되었습니다:', log)
            next()
        }
        catch (err) {
            console.log("오류", err)
            next (err)
        }
    })
    next()
}


module.exports = { logging }