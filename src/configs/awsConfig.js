//Import
const AWS = require("aws-sdk")
const multer = require("multer")
const multerS3 = require("multer-s3")
const fs = require('fs')

try {
	fs.readdirSync('uploads') // 폴더 확인
    console.log("실행")
} catch(err) {
	console.error('uploads 폴더가 없습니다..')
}

//aws region 및 자격증명 설정
AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: "ap-northeast-2",
})

const uploadServer = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            const uploadpath = path.join(process.cwd(), "../uploads")
            done(null, uploadpath)
        },
        filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
            const ext = path.extname(file.originalname); // 파일의 확장자
            done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
        }
    })
})

const S3 = new AWS.S3()
const uploadS3 = multer({
    storage: multerS3({
        s3: S3,
        bucket: process.env.S3_BUCKET_NAME,
        filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
            const ext = path.extname(file.originalname); // 파일의 확장자
            done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
        }
    })
})

module.exports = { S3 ,uploadServer, uploadS3  }