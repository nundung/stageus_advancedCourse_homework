// Import
// 다른 자바스크립트를 임포트할수 있도록해주는 명령어require
const { Pool } = require("pg") //require()는 CommonJS 모듈 시스템에서 사용되고, import는 ES6 모듈 시스템에서 사용된다

require('dotenv').config()

const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.DATABASE,
    port: process.env.PORT
})

pool.connect()

module.exports = pool