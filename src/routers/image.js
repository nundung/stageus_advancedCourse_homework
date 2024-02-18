//Import
const router = require('express').Router();
const controller = require('../controllers/postController');
const { validationHandler } = require('../middlewares/validationHandler');
const { check } = require('express-validator');
const { isToken } = require('../middlewares/isToken');
const { uploadS3, uploadServer } = require('../middlewares/uploadImage');

//이미지 업로드 (서버)
router.post('/server', isToken, uploadServer.single('file'), (req, res, next) => {
    try {
        res.status(200).send('파일 업로드 완료');
    } catch (err) {
        next(err);
    }
});

//이미지 업로드 (S3)
router.post('/s3', isToken, uploadS3.single('file'), (req, res, next) => {
    try {
        res.status(200).send('파일 업로드 완료');
    } catch (err) {
        next(err);
    }
});

//이미지 보기 (서버)
router.get(
    '/server/:file',
    isToken,
    check('file').notEmpty().withMessage('이미지 파일 없음'),
    validationHandler,
    (req, res, next) => {
        try {
            const file = req.params.file;
            const imagePath = path.join(__dirname, '../../../uploads/', file);
            console.log('Image Path:', imagePath);

            // 해당 경로에 파일이 존재하는지 확인
            if (fs.existsSync(imagePath)) {
                // 파일이 존재하면 응답으로 해당 파일을 보내줌
                res.sendFile(imagePath);
            }
        } catch (err) {
            next(err);
        }
    }
);

//이미지 보기 (S3)
router.get(
    '/s3/:file',
    isToken,
    check('file').notEmpty().withMessage('이미지 파일 없음'),
    validationHandler,
    (req, res, next) => {
        try {
            const file = req.params.file;

            // S3에서 이미지 다운로드
            const params = { Bucket: 'nundung', Key: file };
            S3.getObject(params, (err, data) => {
                if (err) {
                    console.error('Error loading image from S3:', err);
                    return next(err);
                }

                // 이미지를 가져오고 응답으로 전송
                res.setHeader('Content-Type', data.ContentType);
                res.send(data.Body);
            });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;
