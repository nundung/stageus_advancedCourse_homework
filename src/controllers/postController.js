const { pool } = require('../databases/postgreSql')
const redis = require("redis").createClient()

//게시물 목록(게시판)
const postList = async (req, res, next) => {
    const result = { "data": null }
    try {
        const sql = 
        `SELECT account.id, post.* 
        FROM post JOIN account 
        ON post.account_idx = account.idx 
        ORDER BY post.idx DESC`
        // JOIN account ON post.account_idx = account.idx:
        // post 테이블과 account 테이블을 account_idx와 idx 열을 기준으로 조인. post 테이블의 account_idx와 account 테이블의 idx 값이 일치하는 행을 연결
        
        const data = await pool.query(sql)
        if (data.rowCount > 0) {
            result.data = data.rows
            res.status(200).send(result)
        }
        else {
            res.status(200).send("게시글 목록이 비어있습니다.")
        }
    }
    catch (err) {
        next(err)
    }
}

//게시글 검색
const searchPost = async (req, res, next) => {
    const { title, sort } = req.query
    const result = { "data": null }
    const idx = req.decoded.idx
    console.log(idx)
    console.log(title)
    const time = new Date
    try {
        const sql = 
        `SELECT account.id, post.* 
        FROM post JOIN account 
        ON post.account_idx = account.idx 
        WHERE post.title ILIKE '%' || $1 || '%'
        ORDER BY post.idx=$2`
        // JOIN account ON post.account_idx = account.idx:
        // post 테이블과 account 테이블을 account_idx와 idx 열을 기준으로 조인. post 테이블의 account_idx와 account 테이블의 idx 값이 일치하는 행을 연결
        
        const values = [title, sort]
        const data = await pool.query(sql, values)

        await redis.connect()
        await redis.zAdd(`searchList${idx}`, {
            score: time.getTime(),
            value: title
        })
        await redis.disconnect()
        
        if (data.rowCount > 0) {
            result.data = data.rows
            res.status(200).send(result)
        }
        else {
            res.status(200).send("게시글 목록이 비어있습니다.")
        }

    }
    catch (err) {
        next(err)
    }
}


//최근 검색어 목록
const searchList = async (req, res, next) => {
    const result = {
        "success": false,
        "message": "",
        "data": {
            "searchList": null
        }
    }
    const idx = req.decoded.idx
    try {
        await redis.connect()
        const searchList = await redis.ZRANGE(`searchList${idx}`, 0, 4)
        await redis.disconnect()

        result.data.searchList = searchList
        result.success = true
        res.status(200).send(result)
    }
    catch (err) {
        next (err)
    }
}

//게시글 업로드
const uploadPost = async (req, res, next) => {
    const { title, content } = req.body
    try {
        const authInfo = req.decoded
        const idx = authInfo.idx

        const sql = "INSERT INTO post(account_idx, title, content) VALUES ($1, $2, $3)"
        const values = [idx, title, content]
        await pool.query(sql, values)

        res.status(200).send()
    }
    catch (err) {
        next(err)
    }
}

//게시글 보기
const readPost = async (req, res, next) => {
    const postIdx = req.params.postidx
    const result = { "data": null }
    try {
        const sql = 
        `SELECT account.id, post.*
        FROM post JOIN account 
        ON post.account_idx = account.idx
        WHERE post.idx=$1`
        const values = [postIdx]
        const data = await pool.query(sql, values)

        if (data.rowCount === 0) {
            const e = new Error("게시글을 찾을 수 없습니다.")
            e.status = 500      
            throw e
        }
        result.data = data.rows
        res.status(200).send(result)
    }
    catch (err) {
        next(err)
    }
}

//게시글 수정
const editPost = async (req, res, next) => {
    const postIdx = req.params.postidx
    const { title, content } = req.body
    try {
        const authInfo = req.decoded
        const idx = authInfo.idx

        const sql = "UPDATE post SET title=$1, content=$2 WHERE idx=$3 AND account_idx=$4"
        const values = [title, content, postIdx, idx]
        await pool.query(sql, values)

        res.status(200).send()
    }
    catch (err) {
        next (err)
    }
}

//게시글 삭제
const deletePost = async (req, res, next) => {
    const postIdx = req.params.postidx
    try {
        const authInfo = req.decoded
        const idx = authInfo.idx

        const sql = "DELETE FROM post WHERE idx=$1 AND account_idx=$2"
        const values = [postIdx, idx]
        await pool.query(sql, values) 

        res.status(200).send()
    }
    catch (err) {
        next (err)
    }
}

module.exports = {
    postList,
    searchPost,
    searchList,
    uploadPost,
    readPost,
    editPost,
    deletePost
}