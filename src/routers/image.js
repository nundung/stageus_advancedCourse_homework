//Import
const router = require("express").Router()
const controller = require("../controllers/imageController")
const { isToken } = require("../middlewares/isToken")
const { check, body } = require("express-validator")
const { validationHandler }  = require("../middlewares/validationHandler")


//이미지 업로드 (서버)
router.post(
    "/server",
    isToken,
    body("file").notEmpty().withMessage("이미지 파일 없음"),
    validationHandler,
    controller.uploadImageServer
)

//이미지 업로드 (S3)
router.post(
    "/s3",
    isToken,
    check("file").notEmpty().withMessage("이미지 파일 없음"),
    validationHandler,
    controller.uploadImageS3
)

//이미지 보기 (서버)
router.get(
    "/server/:file",
    isToken,
    check("file").notEmpty().withMessage("이미지 파일 없음"),
    validationHandler,
    controller.viewImageServer
)

//이미지 보기 (S3)
router.get(
    "/s3/:file",
    isToken,
    check("file").notEmpty().withMessage("이미지 파일 없음"),
    validationHandler,
    controller.viewImageS3
)

module.exports = router