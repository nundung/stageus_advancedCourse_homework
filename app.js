//Import
//외부모듈을 불러오는 코드
//require: 다른 자바스크립트파일을 임포트하는 명령어
const express = require("express")
const jwt = require("jsonwebtoken")
const session = require("express-session")
const FileStore = require("session-file-store")(session)
require('dotenv').config()

//Init
const app = express()   // Express 애플리케이션을 생성하고, 생성된 애플리케이션을 app 변수에 할당한다.
const port = 8000
app.use(express.json())   //보낼 json을 자동으로 string으로 변환 / 받은 string을

app.use(session({ 
    secret: process.env.SESSION_SECRET,   // 세션을 암호화, 난수로 만들라고 하셨음
    resave: false,            // 세션을 항상 저장할지 결정 (false를 권장)     
    saveUninitialized: false,
    // 초기화 되지 않은채로 스토어에 저장할지를 결정
    //세션을 사용하는 데 필요한 정보가 없는 초기 세션은 저장되지 않아 서버의 성능 향상에 도움이 됨
    store: new FileStore()    // 데이터를 저장하는 형식
    //store: mongo.create({ mongoUrl: "db_url" })
}))

//Apis
const { log } = require("./src/middlewares/log")
app.use(log)

const accountApi = require("./src/routers/account")
app.use("/account", accountApi)

const postApi = require("./src/routers/post")
app.use("/post", postApi, )

const commentApi = require("./src/routers/comment")
app.use("/comment", commentApi)

const adminApi = require("./src/routers/admin")
app.use("/admin", adminApi)

const { errorHandling } = require("./src/middlewares/errorHandling")
app.use(errorHandling)


//web Server
app.listen(port, () => {
    console.log(`${port}번에서 HTTP 웹서버 실행`)
})
//콜백함수
//이 메소드는 애플리케이션이 특정 포트에서 들어오는 HTTP 요청을 수신할 수 있도록 서버를 시작
//Express 웹 서버를 지정된 포트에서 실행하고, 서버가 시작될 때 콘솔에 메시지를 출력하는 역할