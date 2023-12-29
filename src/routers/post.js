//Import
const router = require("express").Router()
const client = require('../../psql')
const exception = require('../modules/exception')

//Apis
//게시물 목록(게시판)
router.get("/", async (req, res) => {
    const postBoardResult = {
        "success": false,
        "message": "",
        "data": null
    }
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.")
        
        //db에 값 입력하기
        const sql = "SELECT * FROM post ORDER BY idx DESC"
        const data = await client.query(sql)

        if (data.rowCount > 0) {
            postBoardResult.success = true
            postBoardResult.data = data.rows
        }
        else {
            postBoardResult.success = true
            postBoardResult.message = "게시글 목록이 비어있습니다."
        }
    }
    catch (e) {
        postBoardResult.message = e.message
    }
    finally {
        if(client) client.end()
        res.send(postBoardResult)
    }
})

//게시글 업로드
router.post("/",  async (req, res) => {
    const {title, content} = req.body
    const uploadPostResult = {
        "success": false,
        "message": ""
    }
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.")
        const idx = req.session.user.idx

        exception.titleCheck(title)
        exception.contentCheck(content)

        const sql = "INSERT INTO post(account_idx, title, content) VALUES ($1, $2, $3)"
        const values = [idx, title, content]
        const data = await client.query(sql, values)

        if (data.rowCount === 0) throw new Error("게시글 업로드 실패")

        uploadPostResult.success = true
    }
    catch (e) {
        uploadPostResult.message = e.message
    }
    finally {
        if(client) client.end()
        res.send(uploadPostResult)
    }
})

//게시글 보기
router.get("/:postidx", async (req, res) => {
    const postIdx = req.params.postidx;
    const viewPostResult = {
        "success": false,
        "message": "",
        "data": null
    }
    try {
        if(!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.")
        const sql = "SELECT account_idx, title, content FROM post WHERE idx=$1"
        const values = [postIdx]
        const data = await client.query(sql, values)

            if (data.rowCount === 0) throw new Error("게시글을 찾을 수 없습니다.")

            viewPostResult.success = true
            viewPostResult.data = data.rows
    }
    catch (e) {
        viewPostResult.message = e.message
        res.status(400).send(viewPostResult)
    }
    finally {
        if(client) client.end()
        res.send(viewPostResult)
    }
})

//게시글 수정
router.put("/:postidx", async (req, res) => {
    const postIdx = req.params.postidx
    const {title, content} = req.body
    const editPostResult = {
        "success": false,
        "message": ""
    }
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.");
        const idx = req.session.user.idx

        exception.titleCheck(title)
        exception.contentCheck(content)
        const sql = "UPDATE post SET title=$1, content=$2 WHERE idx=$3 AND account_idx=$4"
        const values = [title, content, postIdx, idx]
        const data = await client.query(sql, values)

        if (data.rowCount === 0) throw new Error("게시글 수정 실패")

        editPostResult.success = true
        editPostResult.message = "게시글 수정이 완료되었습니다."
    }
    catch (e) {
        editPostResult.message = e.message
    }
    finally {
        if(client) client.end()
        res.send(editPostResult)
    }
})


//게시글 삭제
router.delete("/:postidx", async (req, res) => {
    const postIdx = req.params.postidx;
    const deletePostResult = {
        "success": false,
        "message": ""
    }
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.")
        const idx = req.session.user.idx
    console.log(idx)

        const sql = "DELETE FROM post WHERE idx=$1 AND account_idx=$2"
        const values = [postIdx, idx]
        const data = await client.query(sql, values) 
        
        if (data.rowCount === 0) throw new Error("게시글 삭제 실패")

        deletePostResult.success = true
        deletePostResult.message = "게시글이 삭제되었습니다."
    }
    catch (e) {
        deletePostResult.message = e.message
    }
    finally {
        if(client) client.end()
        res.send(deletePostResult)
    }
})


module.exports = router