//Import
const express = require("express")
require('dotenv').config()

//Init
const app = express()   // Express 애플리케이s션을 생성하고, 생성된 애플리케이션을 app 변수에 할당한다.
const port = 8000
app.use(express.json())   //보낼 json을 자동으로 string으로 변환 / 받은 string을

//Apis
const { log } = require("./src/middlewares/log")
app.use(log)

const visitorApi = require("./src/routers/visitor")
app.use("/visitor", visitorApi)

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