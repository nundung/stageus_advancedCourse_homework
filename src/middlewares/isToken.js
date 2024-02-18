const jwt = require('jsonwebtoken');
const { pool } = require('../databases/postgreSql');

const isToken = (req, res, next) => {
    const { authorization } = req.headers;
    const result = {
        message: '',
    };
    try {
        if (!authorization || authorization.trim() === '') {
            const e = new Error('Authorization 헤더가 필요합니다.');
            e.status = 401;
            throw e;
        }

        const token = authorization.split(' ')[1];
        //barear token 이라서 분리해줌

        if (!token || token == '{{token}}') {
            const e = new Error('로그인이 필요합니다.');
            e.status = 409;
            throw e;
        }

        req.decoded = jwt.verify(token, process.env.SECRET_KEY);
        //이 명령어의 반환값이 바로 token에 있는 payload로 변환한 것
        next();
    } catch (err) {
        if (err.message === 'jwt expired') {
            result.message = '로그인이 만료되었습니다.';
        } else if (err.message === 'invalid token') {
            result.message = '유효하지 않은 토큰';
        } else if (err.message === 'jwt malformed') {
            result.message = '토큰 형식 잘못 됨';
        }
        next(err);
    }
};

const isNotToken = (req, res, next) => {
    const { authorization } = req.headers;
    const result = {
        message: '',
    };
    try {
        if (!authorization || authorization.trim() === '') {
            return next();
        }

        const token = authorization.split(' ')[1];
        //barear token 이라서 분리해줌

        if (!token || token == '{{token}}') {
            return next();
        }

        const e = new Error('이미 로그인 되어있습니다.');
        e.status = 403;
        throw e;
    } catch (err) {
        next(err);
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const authInfo = req.decoded;
        const isAdmin = authInfo.isAdmin;

        if (isAdmin === false) {
            const err = new Error('접근 권한이 없습니다.');
            err.status = 401; //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다. (인증X)
            next(err);
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { isToken, isNotToken, isAdmin };
