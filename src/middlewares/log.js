//Import
const { logModel } = require("../databases/mongoDb")

const log = async (err, req, res, next) => {
    // 여기서 logModel을 사용하여 로그를 MongoDB에 저장하는 작업을 수행
    const logData = {
        ip: req.ip,
        id: req.session.user ? req.session.user.id : 'unknown', 
        url: req.originalUrl,
        method: req.method,
        requestedTimestamp: new Date(),
        respondedTimestamp: null, 
        status: res.statusCode, 
        stackTrace: null
    }
    res.on('finish', async () => {
        console.log("순서2")
        logData.respondedTimestamp = new Date() // 응답 시간을 현재 시간으로 설정
        logData.status = req.errorData ? req.errorData.statusCode : res.statusCode;
        logData.stackTrace = req.errorData ? req.errorData.stackTrace : null;
        try {
            const log = await logModel.create(logData)
            console.log('로그가 성공적으로 저장되었습니다:', log)
        }
        catch (err) {
            console.log("오류", err)
        }
    })
    next()
}


module.exports = { log }