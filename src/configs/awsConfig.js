//Import
const AWS = require("aws-sdk")
const multer = require("multer")
const multerS3 = require("multer-s3")
const path = require("path")

//aws region 및 자격증명 설정
AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
})


const uploadServer = multer({
    dest: path.join(__dirname, "../../../uploads/")
})

const s3 = new AWS.S3()