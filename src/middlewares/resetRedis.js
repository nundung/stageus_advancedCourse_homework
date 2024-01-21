//Import
const { pool } = require("../databases/postgreSql")
const redis = require("redis").createClient()


// const databaseIndexToReset = 1; // 특정 데이터베이스 인덱스
const resetRedis = ( async (redisKey) => {
    console.log("Redis초기화")
    try {
        // Redis 초기화
        await redis.connect()
        const visitor = await redis.sCard("visitor")
        await redis.DEL(redisKey)
        console.log(`Redis 키 ${redisKey} 삭제 완료.`)
        await redis.disconnect()

        const sql = "INSERT INTO visitor_hour (visitor) VALUES ($1)" //물음표 여러개면 $1, $2, $3
        const values = [ visitor ]
        const data = await pool.query(sql, values)

    } 
    catch (err) {
        console.error('레디스 리셋 중 오류 발생', err.message)
    }
})

const redisKeyToReset = "visitor"

resetRedis(redisKeyToReset)