
const schedule = require('node-schedule')
const redis = require("redis").createClient()

// const databaseIndexToReset = 1; // 특정 데이터베이스 인덱스
const resetRedis = schedule.scheduleJob('0 * * * *', async () => {
    console.log("Redis초기화")
    try {
        await pool.query
        // Redis 초기화
        await redis.connect()
        // await redis.SELECT(databaseIndexToReset);
        await redis.FLUSHALL()
        console.log('Redis reset completed.')
        await redis.disconnect()
    } catch (err) {
        console.error('Error updating and resetting Redis:', err.message)
    }
})