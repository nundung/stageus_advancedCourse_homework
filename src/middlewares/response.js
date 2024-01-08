
const responseTime = async (req, res, next) => {
    const time = Date.now() // 요청 시작 시간 기록

    res.on('finish', () => {
        req.responseTime = time // 요청 객체에 응답 시간 추가
    })
}

    module.exports = { responseTime }
