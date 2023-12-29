//Import
const router = require("express").Router()
const pool = require('../../psql')
const exception = require('../modules/exception')

//Apis
//게시물 목록(게시판)
router.get("/", async (req, res) => {
    const postBoardResult = {
        "message": "",
        "data": null
    }
    const client = await pool.connect()
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.")
        
        //db에 값 입력하기
        const sql = "SELECT account.id, post.* FROM post JOIN account ON post.account_idx = account.idx ORDER BY post.idx DESC" 
        // JOIN account ON post.account_idx = account.idx:
        // post 테이블과 account 테이블을 account_idx와 idx 열을 기준으로 조인. post 테이블의 account_idx와 account 테이블의 idx 값이 일치하는 행을 연결
        const data = await client.query(sql)

        if (data.rowCount > 0) {
            postBoardResult.data = data.rows
            res.status(200).send(postBoardResult)
        }
        else {
            postBoardResult.message = "게시글 목록이 비어있습니다."
            res.status(200).send(postBoardResult)
        }
    }
    catch (e) {
        postBoardResult.message = e.message
        res.status(400).send(postBoardResult)
    }
    finally {
        if(client) client.release()
    }
})

//게시글 업로드
router.post("/",  async (req, res) => {
    const {title, content} = req.body
    const uploadPostResult = {
        "message": ""
    }
    const client = await pool.connect()
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.")
        const idx = req.session.user.idx

        exception.titleCheck(title)
        exception.contentCheck(content)

        const sql = "INSERT INTO post(account_idx, title, content) VALUES ($1, $2, $3)"
        const values = [idx, title, content]
        const data = await client.query(sql, values)

        if (data.rowCount === 0) throw new Error("게시글 업로드 실패")

        res.status(200).send(uploadPostResult)
    }
    catch (e) {
        uploadPostResult.message = e.message
        res.status(400).send(uploadPostResult)
    }
    finally {
        if(client) client.release()
    }
})

//게시글 보기
router.get("/:postidx", async (req, res) => {
    const postIdx = req.params.postidx;
    const viewPostResult = {
        "message": "",
        "data": null
    }
    const client = await pool.connect()
    try {
        if(!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.")
        const sql = "SELECT account.id, post.* FROM post JOIN account ON post.account_idx = account.idx WHERE post.idx=$1"
        const values = [postIdx]
        const data = await client.query(sql, values)

        if (data.rowCount === 0) throw new Error("게시글을 찾을 수 없습니다.")

        viewPostResult.data = data.rows
        res.status(200).send(viewPostResult)

    }
    catch (e) {
        viewPostResult.message = e.message
        res.status(400).send(viewPostResult)
    }
    finally {
        if(client) client.release()
    }
})

//게시글 수정
router.put("/:postidx", async (req, res) => {
    const postIdx = req.params.postidx
    const {title, content} = req.body
    const editPostResult = {
        "message": ""
    }
    const client = await pool.connect()
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.");
        const idx = req.session.user.idx

        exception.titleCheck(title)
        exception.contentCheck(content)
        const sql = "UPDATE post SET title=$1, content=$2 WHERE idx=$3 AND account_idx=$4"
        const values = [title, content, postIdx, idx]
        const data = await client.query(sql, values)

        if (data.rowCount === 0) throw new Error("게시글 수정 실패")

        editPostResult.message = "게시글 수정이 완료되었습니다."
        res.status(200).send(editPostResult)
    }
    catch (e) {
        editPostResult.message = e.message
        res.status(400).send(editPostResult)
    }
    finally {
        if(client) client.release()
    }
})


//게시글 삭제
router.delete("/:postidx", async (req, res) => {
    const postIdx = req.params.postidx;
    const deletePostResult = {
        "message": ""
    }
    const client = await pool.connect()
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.")
        const idx = req.session.user.idx
    console.log(idx)

        const sql = "DELETE FROM post WHERE idx=$1 AND account_idx=$2"
        const values = [postIdx, idx]
        const data = await client.query(sql, values) 
        
        if (data.rowCount === 0) throw new Error("게시글 삭제 실패")

        deletePostResult.message = "게시글이 삭제되었습니다."
        res.status(200).send(deletePostResult)
    }
    catch (e) {
        deletePostResult.message = e.message
        res.status(400).send(deletePostResult)
    }
    finally {
        if(client) client.release()
    }
})


module.exports = router