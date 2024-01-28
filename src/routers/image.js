//Import
const router = require("express").Router()
const controller = require("../controllers/imageController")
const { isToken } = require("../middlewares/isToken")
const multer = require("multer")
const multerS3 = require("multer-s3")
const AWS = require("aws-sdk")
const path = require("path")

const upload = multer({
    dest: path.join(__dirname, "../../../uploads/")
})

//이미지 업로드 (서버)
router.post(
    "/server",
    isToken,
    upload.single("file"),
    controller.uploadImageServer
)


//이미지 업로드 (S3)
router.post(
    "/s3",
    isToken,
    controller.uploadImageS3
)


//이미지 보기 (서버)
router.get(
    "/server/:file",
    isToken,
    controller.viewImageServer
)

module.exports = router