const path = require("path");
const fs = require("fs");

//이미지 업로드 (서버)
const uploadImageServer = async (req, res, next) => {
    try {
        const image = req.file
        if(!image) {
            throw err
        }
        res.status(200).send("파일 업로드 완료")
    }
    catch (err) {
        next(err)
    }
}

//이미지 업로드 (S3)
const uploadImageS3 = async (req, res, next) => {
    try {
        const image = req.file
        if(!image) {
            throw err
        }
        const authInfo = req.decoded
        const idx = authInfo.idx
    }
    catch (err) {
        next(err)
    }
}

//이미지 보기 (서버)
const viewImageServer = (req, res, next) => {
    try {
        const file = req.params.file;
        const imagePath = path.join(__dirname, "../../../uploads/", file);

        const directoryPath = path.join(__dirname, "../../../uploads/");

        console.log(file)
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                throw err;
            }

            console.log("Files in directory:", files);
        }
        )
        // 해당 경로에 파일이 존재하는지 확인
        if (fs.existsSync(imagePath)) {
            // 파일이 존재하면 응답으로 해당 파일을 보내줌
            res.sendFile(imagePath);
        }

    } catch (err) {
        next(err);
    }
}

module.exports = { uploadImageServer, uploadImageS3, viewImageServer }

