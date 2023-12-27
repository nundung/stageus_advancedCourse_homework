// Import
// 다른 자바스크립트를 임포트할수 있도록해주는 명령어require
const { Client } = require("pg")

const client = new Client({
    user: "ubuntu",
    password: "1234",
    host: "localhost",
    database: "week14homework",
    port: 5432,
})

client.connect()


module.exports = client