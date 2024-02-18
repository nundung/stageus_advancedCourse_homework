//Import
const { logModel } = require('../databases/mongoDb');

const log = async (req, res, next) => {
    // 여기서 logModel을 사용하여 로그를 MongoDB에 저장하는 작업을 수행
    const logData = {
        ip: req.ip,
        idx: req.decoded ? req.decoded.idx : 'unknown',
        url: req.originalUrl,
        method: req.method,
        requestedTimestamp: new Date(),
        respondedTimestamp: null,
        status: null,
        stackTrace: null,
    };
    res.on('finish', async () => {
        logData.respondedTimestamp = new Date(); // 응답 시간을 현재 시간으로 설정
        logData.status = res.locals.error ? res.locals.error.statusCode : res.statusCode;
        logData.stackTrace = res.locals.error ? res.locals.error.stackTrace : null;
        logData.message = res.locals.error ? res.locals.error.message : null;

        try {
            const log = await logModel.create(logData);
            console.log('로그가 성공적으로 저장되었습니다:', log);
        } catch (err) {
            console.log('오류', err);
        }
    });
    next();
};

module.exports = { log };
