//Import
const router = require('express').Router();
const controller = require('../controllers/postController');
const { validateSort } = require('../middlewares/checkRegulation');
const { validationHandler } = require('../middlewares/validationHandler');
const { body, check } = require('express-validator');
const { isToken } = require('../middlewares/isToken');
const { uploadS3 } = require('../middlewares/uploadImage');

//Apis
//게시글 목록(게시판)
router.get('/', isToken, controller.postList);

//게시글 검색
router.get(
    '/search',
    isToken,
    [
        check('sort')
            .custom((sort) => validateSort(sort))
            .withMessage('유효하지 않은 정렬형식'),
        check('title').notEmpty().isLength({ min: 1, max: 100 }).withMessage('제목은 1~100자'),
    ],
    validationHandler,
    controller.searchPost
);

//최근 검색어 목록
router.get('/search/recent', isToken, controller.searchList);

//게시글 업로드
router.post(
    '/',
    isToken,
    uploadS3.array('files', 5),
    [
        body('title').notEmpty().isLength({ min: 1, max: 100 }).withMessage('제목은 1~100자'),
        body('content').notEmpty().isLength({ min: 1, max: 1000 }).withMessage('본문은 1~1000자'),
    ],
    validationHandler,
    controller.uploadPost
);

//게시글 보기
router.get('/:postidx', isToken, controller.readPost);

//게시글 수정
router.put(
    '/:postidx',
    isToken,
    [
        check('title').notEmpty().isLength({ min: 1, max: 100 }).withMessage('제목은 1~100자'),
        check('content').notEmpty().isLength({ min: 1, max: 1000 }).withMessage('본문은 1~1000자'),
    ],
    validationHandler,
    controller.editPost
);

//게시글 삭제
router.delete('/:postidx', isToken, controller.deletePost);

module.exports = router;
