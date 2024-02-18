const { pool } = require('../databases/postgreSql');
const redis = require('redis').createClient();

//게시물 목록(게시판)
const postList = async (req, res, next) => {
    const result = { data: null };
    try {
        const sql = `SELECT account.id, post.*, COUNT(image.idx) AS image_count
        FROM post 
        JOIN account ON post.account_idx = account.idx 
        LEFT JOIN image ON post.idx = image.post_idx
        GROUP BY account.id, post.idx
        ORDER BY post.idx DESC`;
        // JOIN account ON post.account_idx = account.idx:
        // post 테이블과 account 테이블을 account_idx와 idx 열을 기준으로 조인. post 테이블의 account_idx와 account 테이블의 idx 값이 일치하는 행을 연결

        const data = await pool.query(sql);
        if (data.rowCount > 0) {
            result.data = data.rows;
            res.status(200).send(result);
        } else {
            res.status(200).send('게시글 목록이 비어있습니다.');
        }
    } catch (err) {
        next(err);
    }
};

//게시글 검색
const searchPost = async (req, res, next) => {
    const { title, sort } = req.query;
    const result = { data: null };
    const idx = req.decoded.idx;
    console.log(idx);
    console.log(title);
    const time = new Date();
    try {
        await redis.connect();
        await redis.zAdd(`searchList${idx}`, {
            score: time.getTime(),
            value: title,
        });
        await redis.disconnect();

        const sql = `SELECT account.id, post.*, COUNT(image.idx) AS image_count
        FROM post 
        JOIN account ON post.account_idx = account.idx 
        LEFT JOIN image ON post.idx = image.post_idx
        WHERE post.title ILIKE '%' || ${title} || '%'
        GROUP BY account.id, post.idx
        ORDER BY post.idx ${sort}`;
        // JOIN account ON post.account_idx = account.idx:
        // post 테이블과 account 테이블을 account_idx와 idx 열을 기준으로 조인. post 테이블의 account_idx와 account 테이블의 idx 값이 일치하는 행을 연결

        const data = await pool.query(sql);

        if (data.rowCount > 0) {
            result.data = data.rows;
            res.status(200).send(result);
        } else {
            res.status(200).send('게시글 목록이 비어있습니다.');
        }
    } catch (err) {
        next(err);
    }
};

//최근 검색어 목록
const searchList = async (req, res, next) => {
    const result = {
        success: false,
        message: '',
        data: {
            searchList: null,
        },
    };
    const idx = req.decoded.idx;
    try {
        await redis.connect();
        const searchList = await redis.zRange(`searchList${idx}`, 0, 4, { REV: true });
        await redis.disconnect();

        result.data.searchList = searchList;
        result.success = true;
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
};

//게시글 업로드
const uploadPost = async (req, res, next) => {
    const { title, content } = req.body;
    try {
        const authInfo = req.decoded;
        const idx = authInfo.idx;
        // const imagePath = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${req.files.key}`;

        const postSql = `INSERT INTO post(account_idx, title, content) 
        VALUES ($1, $2, $3) RETURNING idx;`;
        const postValues = [idx, title, content];
        const postResult = await pool.query(postSql, postValues);

        const fileInfos = req.files.map((file) => {
            const imageSql = `INSERT INTO image(post_idx, account_idx, path, created_at)
            VALUES ($1, $2, $3, $4)`;
            const imageValues = [postResult.rows[0].idx, idx, file.location, new Date()];
            pool.query(imageSql, imageValues);
            return {
                originalname: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                size: file.size,
                location: file.location, // 이미지 경로
            };
        });
        res.status(200).send();
        // res.json({ imagePath })
    } catch (err) {
        next(err);
    }
};

//게시글 보기
const readPost = async (req, res, next) => {
    const postIdx = req.params.postidx;
    const result = { data: null };
    try {
        const postSql = `SELECT account.id, post.*
        FROM post
        JOIN account ON post.account_idx = account.idx
        WHERE post.idx=$1`;
        const postValues = [postIdx];
        const postData = await pool.query(postSql, postValues);

        if (postData.rowCount === 0) {
            const e = new Error('게시글을 찾을 수 없습니다.');
            e.status = 500;
            throw e;
        }

        const imageSql = `SELECT path
        FROM image
        WHERE post_idx = $1`;
        const imageValues = [postIdx];
        const imageData = await pool.query(imageSql, imageValues);

        const postInfo = postData.rows[0];
        postInfo.images = imageData.rows;
        result.data = postInfo;
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
};

//게시글 수정
const editPost = async (req, res, next) => {
    const postIdx = req.params.postidx;
    const { title, content } = req.body;
    try {
        const authInfo = req.decoded;
        const idx = authInfo.idx;

        const postSql = `UPDATE post 
        SET title=$1, content=$2 
        WHERE idx=$3 AND account_idx=$4`;
        const postValues = [title, content, postIdx, idx];
        await pool.query(postSql, postValues);

        const imageSql = `SELECT image.path
        FROM image
        WHERE image.post_idx=$1`;
        const imageValues = [postIdx];
        const imageData = await pool.query(imageSql, imageValues);

        const postInfo = postData.rows[0];
        postInfo.images = imageData.rows;
        result.data = postInfo;
        res.status(200).send(result);
        res.status(200).send();
    } catch (err) {
        next(err);
    }
};

//게시글 삭제
const deletePost = async (req, res, next) => {
    const postIdx = req.params.postidx;
    try {
        const authInfo = req.decoded;
        const idx = authInfo.idx;

        const imageSql = `DELETE FROM image
        WHERE image.post_idx=$1 AND account_idx=$2`;
        const imageValues = [postIdx, idx];
        await pool.query(imageSql, imageValues);

        const postSql = `DELETE FROM post 
        WHERE idx=$1 AND account_idx=$2`;
        const postValues = [postIdx, idx];
        await pool.query(postSql, postValues);

        res.status(200).send('게시물이 삭제되었습니다.');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    postList,
    searchPost,
    searchList,
    uploadPost,
    readPost,
    editPost,
    deletePost,
};
