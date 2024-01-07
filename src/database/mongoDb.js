const mongoose = require('mongoose')
const Schema = mongoose.Schema

// MongoDB 서버 연결 설정
mongoose.connect('mongodb://localhost:27017/15weekhomework', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// 연결 실패 시 에러 처리
mongoose.connection.on('error', console.error.bind(console, 'MongoDB 연결 오류:'))

// 연결 성공 시 메시지 출력
mongoose.connection.once('open', () => {
    console.log('MongoDB에 연결되었습니다!')
})

// 로그용 스키마 정의
const logSchema = new Schema({
    ip: { type: String, required: true },
    id: { type: String, required: false },
    url: { type: String, required: true },
    method: { type: String, required: true },
    requestedTimestamp: { type: Date, required: true },
    respondedTimestamp: { type: Date, required: true },
    status: { type: Number, required: true },
    stacktrace: { type: String }
})

// 로그 모델 생성
const logModel = mongoose.model('LogModel', logSchema)

module.exports = { logModel }
