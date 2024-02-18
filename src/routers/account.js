//Import
const router = require('express').Router();
const controller = require('../controllers/accountController');
const isDuplicate = require('../middlewares/isDuplicate');
const { body } = require('express-validator');
const { validationHandler } = require('../middlewares/validationHandler');
const {
    validateId,
    validatePw,
    validateName,
    validatePhonenumber,
} = require('../middlewares/checkRegulation');
const { isToken, isNotToken } = require('../middlewares/isToken');

//Apis
//회원가입 & 아이디/이메일 중복체크
router.post(
    '/',
    isNotToken,
    [
        body('id')
            .notEmpty()
            .withMessage('아이디 없음')
            //아이디 값이 비어있지 않을 경우에만 다음 유효성 검사를 실행
            .if(body('id').notEmpty())
            .isLength({ min: 6, max: 18 })
            .withMessage('아이디는 6~18자')
            .custom((id) => validateId(id))
            .withMessage('유효하지 않은 아이디형식'),

        body('pw')
            .notEmpty()
            .withMessage('비밀번호 없음')
            .if(body('pw').notEmpty())
            .isLength({ min: 8, max: 20 })
            .withMessage('비밀번호는 8~20자')
            .custom((pw) => validatePw(pw))
            .withMessage('유효하지 않은 비밀번호형식'),

        body('name')
            .notEmpty()
            .withMessage('이름 없음')
            .if(body('name').notEmpty())
            .isLength({ min: 2, max: 10 })
            .withMessage('이름은 2~10자')
            .custom((name) => validateName(name))
            .withMessage('유효하지 않은 이름형식'),

        body('phonenumber')
            .notEmpty()
            .withMessage('전화번호 없음')
            .if(body('phonenumber').notEmpty())
            .custom((phonenumber) => validatePhonenumber(phonenumber))
            .withMessage('유효하지 않은 전화번호'),

        body('email')
            .notEmpty()
            .withMessage('이메일 없음')
            .if(body('email').notEmpty())
            .isEmail()
            .withMessage('유효하지 않은 이메일'),
    ],
    validationHandler,
    isDuplicate.id,
    isDuplicate.email,
    isDuplicate.phonenumber,
    controller.register
);

//로그인
router.post(
    '/login',
    isNotToken,
    [
        body('id')
            .notEmpty()
            .withMessage('아이디값 없음')
            .if(body('id').notEmpty())
            .isLength({ min: 6, max: 18 })
            .withMessage('아이디는 6~18자')
            .custom((id) => validateId(id))
            .withMessage('유효하지 않은 아이디'),

        body('pw')
            .notEmpty()
            .withMessage('비밀번호값 없음')
            .if(body('pw').notEmpty())
            .isLength({ min: 8, max: 20 })
            .withMessage('비밀번호는 8~20자')
            .custom((pw) => validatePw(pw))
            .withMessage('유효하지 않은 비밀번호'),
    ],
    validationHandler,
    controller.logIn
);

//로그아웃
router.get('/logout', isToken, (req, res) => {
    const result = { messege: '' };
    result.messege = '로그아웃 됨';
    res.status(200).send(result);
});

//내정보 보기
router.get('/info', isToken, controller.info);

//내정보 수정
router.put(
    '/info',
    isToken,
    [
        body('pw')
            .notEmpty()
            .withMessage('비밀번호값 없음')
            .if(body('pw').notEmpty())
            .isLength({ min: 8, max: 20 })
            .withMessage('비밀번호는 8~20자')
            .custom((pw) => validatePw(pw))
            .withMessage('유효하지 않은 비밀번호'),

        body('name')
            .notEmpty()
            .withMessage('이름값 없음')
            .if(body('name').notEmpty())
            .isLength({ min: 2, max: 10 })
            .withMessage('이름은 2~10자')
            .custom((name) => validateName(name))
            .withMessage('유효하지 않은 이름'),

        body('phonenumber')
            .notEmpty()
            .withMessage('전화번호값 없음')
            .if(body('phonenumber').notEmpty())
            .custom((phonenumber) => validatePhonenumber(phonenumber))
            .withMessage('유효하지 않은 전화번호'),

        body('email')
            .notEmpty()
            .withMessage('이메일값 없음')
            .if(body('email').notEmpty())
            .isEmail()
            .withMessage('유효하지 않은 이메일'),
    ],
    validationHandler,
    isDuplicate.phonenumber,
    isDuplicate.email,
    controller.editInfo
);

//계정 삭제
router.delete('/', isToken, controller.deleteAccount);

module.exports = router;
