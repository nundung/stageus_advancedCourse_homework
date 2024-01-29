//Import
const { S3 } = require("../configs/awsConfig")
const path = require("path")
const multer = require("multer")
const multerS3 = require("multer-s3")


const uploadServer = multer({
    dest: path.join(__dirname, "../../../uploads/")
})

const uploadS3 = multer({
    storage: multerS3({
        s3: S3,
        bucket: "nundung"
    })
})

module.exports = { uploadServer, uploadS3 }
