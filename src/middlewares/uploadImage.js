//Import
const { AWS } = require('../configs/awsConfig');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const uploadServer = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            const uploadpath = path.join(process.cwd(), '../uploads');
            done(null, uploadpath);
        },
        filename(req, file, done) {
            // 파일명을 어떤 이름으로 올릴지
            done(null, `${Date.now()}_${path.basename(file.originalname)}`); // 날짜 + 파일이름 + 확장자 이름으로 저장
        },
    }),
});

const S3 = new AWS.S3();

const uploadS3 = multer({
    storage: multerS3({
        s3: S3,
        bucket: process.env.S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key(req, files, cb) {
            const fileName = `${Date.now()}_${path.basename(files.originalname)}`;
            cb(null, fileName);
        },
    }),
    //* 용량 제한
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { uploadS3, uploadServer };
