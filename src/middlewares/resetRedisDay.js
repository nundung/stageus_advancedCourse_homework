//Import
const { pool } = require("../databases/postgreSql")
const redis = require("redis").createClient()
require('dotenv').config();


const VISITOR_DAY_KEY = process.env.VISITOR_DAY_KEY
const redisKey = VISITOR_DAY_KEY

const resetRedis = ( async (redisKey) => {
    console.log("하루마다 Redis 저장 및 초기화")
    try {
        // Redis 초기화
        await redis.connect()
        const visitor = await redis.sCard(redisKey)
        await redis.DEL(redisKey)
        console.log(`Redis 키 ${redisKey} 삭제 완료.`)
        await redis.disconnect()

        const sql = "INSERT INTO visitor_day (visitor) VALUES ($1)" //물음표 여러개면 $1, $2, $3
        const values = [ visitor ]
        await pool.query(sql, values)

    } 
    catch (err) {
        console.error('레디스 리셋 중 오류 발생', err.message)
    }
})


resetRedis(redisKey)



