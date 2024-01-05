// Import
const express = require("express")
const session = require("express-session")
const FileStore = require("session-file-store")(session)
require('dotenv').config()

// Init
const app = express()
const port = 8000
app.use(express.json()) //보낼 json을 자동으로 string으로 변환 / 받은 string을

app.use(session({ 
    secret: process.env.SESSION_SECRET,   // 세션을 암호화, 난수로 만들라고 하셨음
    resave: false,            // 세션을 항상 저장할지 결정 (false를 권장)     
    saveUninitialized: false,  // 초기화 되지 않은채로 스토어에 저장할지를 결정
    store: new FileStore()    // 데이터를 저장하는 형식
    //store: mongo.create({ mongoUrl: "db_url" })
}))

//Apis

const accountApi = require("./src/routers/account")
app.use("/account", accountApi)

const postApi = require("./src/routers/post")
app.use("/post", postApi)

const commentApi = require("./src/routers/comment")
app.use("/comment", commentApi)

const logApi = require('./src/routers/log')
app.use('/log', logApi)

app.use((err, req, res, next) => {
    const statusCode = err.status || 500    // 에러 객체에 status가 없을 경우 기본값으로 500 설정
    const errorMessage = err.message || '서버 오류가 발생했습니다.';

    res.status(statusCode).json({
        error: {
            message: errorMessage
        }
    })
})

//web Server
app.listen(port, () => {
    console.log(`${port}번에서 HTTP 웹서버 실행`)
})