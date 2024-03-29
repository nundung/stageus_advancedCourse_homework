const path = require('path');
const fs = require('fs');
const { S3, uploadServer, uploadS3 } = require('../configs/awsConfig');

//이미지 업로드
const uploadImage = (req, res, next) => {
    try {
        res.status(200).send('파일 업로드 완료');
    } catch (err) {
        next(err);
    }
};

//이미지 보기 (서버)
const viewImageServer = (req, res, next) => {
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
};

//이미지 보기 (S3)
const viewImageS3 = (req, res, next) => {
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
};

module.exports = { uploadImage, viewImageServer, viewImageS3 };
