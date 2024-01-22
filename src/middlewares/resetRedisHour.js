//Import
const { pool } = require("../databases/postgreSql")
const redis = require("redis").createClient()
require('dotenv').config()

console.log(process.env.PASSWORD)

const VISITOR_HOUR_KEY = process.env.VISITOR_HOUR_KEY
const redisKey = VISITOR_HOUR_KEY
console.log('VISITOR_HOUR_KEY:', VISITOR_HOUR_KEY);

const resetRedis = ( async (redisKey) => {
    console.log("1시간마다 Redis초기화")
    try {
        // Redis 초기화
        await redis.connect()
        console.log(redisKey)
        const visitor = await redis.sCard(redisKey)
        console.log('Size of the set:', visitor);
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


resetRedis(redisKey)