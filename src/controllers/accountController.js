const { pool } = require('../databases/postgreSql');
const jwt = require('jsonwebtoken');
const redis = require('redis').createClient();

//회원가입
const register = async (req, res, next) => {
    const { id, pw, name, email, phonenumber } = req.body;
    try {
        const sql =
            'INSERT INTO account (id, pw, name, email, phonenumber) VALUES ($1, $2, $3, $4, $5)'; //물음표 여러개면 $1, $2, $3
        const values = [id, pw, name, email, phonenumber];
        await pool.query(sql, values);

        res.status(201).send();
        //201은 생성완료라는 뜻
    } catch (err) {
        next(err);
    }
};

//로그인
const logIn = async (req, res, next) => {
    const { id, pw } = req.body;
    const result = {
        message: '',
        data: { token: '' },
    };
    try {
        const sql = 'SELECT * FROM account WHERE id=$1 AND pw=$2'; //물음표 여러개면 $1, $2, $3
        const values = [id, pw];
        const data = await pool.query(sql, values);

        if (data.rowCount === 0) {
            const err = new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
            err.status = 401;
            //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다. (인증X)
            return next(err);
        }
        const idx = data.rows[0].idx;
        const isAdmin = data.rows[0].is_admin;

        const currentDevice = {
            sessionId: req.sessionID,
            userAgent: req.headers['user-agent'],
            clientIP: req.ip,
        };

        const token = jwt.sign(
            {
                idx: idx,
                isAdmin: isAdmin,
                device: currentDevice,
            },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        result.data.token = token;

        const VISITOR_HOUR_KEY = process.env.VISITOR_HOUR_KEY;
        const VISITOR_DAY_KEY = process.env.VISITOR_DAY_KEY;

        await redis.connect();
        await redis.sAdd(`${VISITOR_HOUR_KEY}`, `${idx}`);
        await redis.sAdd(`${VISITOR_DAY_KEY}`, `${idx}`);
        await redis.expire(`${VISITOR_HOUR_KEY}`, 3600); //1시간
        await redis.expire(`${VISITOR_DAY_KEY}`, 86400); //하루
        await redis.disconnect();
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
};

//내정보 보기
const info = async (req, res, next) => {
    const result = { data: null };

    try {
        const authInfo = req.decoded;
        const idx = authInfo.idx;

        // if (id === null || id === "" || id === undefined) throw new Error("아이디 비어있음")

        const sql = 'SELECT * FROM account WHERE idx=$1'; //물음표 여러개면 $1, $2, $3
        const values = [idx];
        const data = await pool.query(sql, values);

        const row = data.rows; //데이터베이스에서 가져온 값들 중 테이블 값만 저장
        result.success = true;
        result.data = row;
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
};

//내정보 수정
const editInfo = async (req, res, next) => {
    const { pw, name, phonenumber, email } = req.body;
    try {
        const authInfo = req.decoded;
        console.log(authInfo);

        const idx = authInfo.idx;
        const sql = 'UPDATE account SET pw=$1, name=$2, phonenumber=$3, email=$4 WHERE idx=$5'; //물음표 여러개면 $1, $2, $3
        const values = [pw, name, phonenumber, email, idx];
        data = await pool.query(sql, values);

        res.status(200).send();
    } catch (err) {
        next(err);
    }
};

//계정 삭제
const deleteAccount = async (req, res, next) => {
    try {
        const authInfo = req.decoded;
        const idx = authInfo.idx;

        const sql = 'DELETE FROM account WHERE idx=$1';
        const values = [idx];
        await pool.query(sql, values);

        req.session.destroy();
        res.clearCookie('connect.sid'); // 세션 쿠키 삭제

        res.status(200).send();
    } catch (err) {
        next(err);
    }
};

module.exports = { register, logIn, info, editInfo, deleteAccount };
