//Import
const AWS = require("aws-sdk")
const path = require("path")
const multer = require("multer")
const multerS3 = require("multer-s3")
const S3 = new AWS.S3()


//aws region 및 자격증명 설정
AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
})

const uploadServer = multer({
    dest: path.join(__dirname, "../../../uploads/")
})

const uploadS3 = multer({
    storage: multerS3({
        s3: S3,
        bucket: process.env.S3_BUCKET_NAME
    })
})

module.exports = { S3 ,uploadServer, uploadS3  }