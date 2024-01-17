//Import
const schedule = require('node-schedule')
const redis = require("redis").createClient()

// 스케줄: 매 시간 0분 0초에 updateAndResetRedis 함수 실행
const resetRedis = schedule.scheduleJob('54 * * * *', async () => {
    console.log("되나")
    try {
        // Redis 초기화
        await redis.connect()
        await redis.flushall()
        console.log('Redis reset completed.');
        await redis.disconnect()
    } catch (err) {
        console.error('Error updating and resetting Redis:', err.message)
    }
})

module.exports = { resetRedis }