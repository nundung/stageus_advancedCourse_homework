//Import
const router = require("express").Router()
const controller = require("../controllers/imageController")
const { isToken } = require("../middlewares/isToken")
const path = require("path")
const multer = require("multer")
const multerS3 = require("multer-s3")
const AWS = require("aws-sdk")
const s3 = new AWS.S3()

const uploadServer = multer({
    dest: path.join(__dirname, "../../../uploads/")
})

const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: "nundung"
    })
})

//이미지 업로드 (서버)
router.post(
    "/server",
    isToken,
    uploadServer.single("file"),
    controller.uploadImageServer
)

//이미지 업로드 (S3)
router.post(
    "/s3",
    isToken,
    uploadS3.single("file"),
    controller.uploadImageS3
)

//이미지 보기 (서버)
router.get(
    "/server/:file",
    isToken,
    controller.viewImageServer
)

//이미지 보기 (S3)
router.get(
    "/s3/:file",
    isToken,
    controller.viewImageS3
)

module.exports = router