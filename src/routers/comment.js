//Import
const router = require("express").Router()
const pool = require("../../psql")
const exception = require("../modules/exception")

//Apis
//댓글 업로드
router.post("/", async (req, res) => {
    const postIdx = req.query.postidx
    const {comment} = req.body
    const uploadCommentResult = {
        "success": false,
        "message": ""
    }
    const client = await pool.connect()
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 존재하지 않습니다.")
        const idx = req.session.user.idx

        exception.commentCheck(comment)

        const sql = "INSERT INTO comment (post_idx, account_idx, content) VALUES ($1, $2, $3)"
        const values = [postIdx, idx, comment]
        client = await pool.connect()
        const data = await client.query(sql, values)

        if (data.rowCount === 0)  throw new Error("댓글 업로드 실패")
        uploadCommentResult.success = true
    }
    catch (e) {
        uploadCommentResult.message = e.message
    }
    finally {
        if(client) client.release()
        res.send(uploadCommentResult)
    }
})

//댓글 보기
router.get("/", async (req, res) => {
    const postIdx = req.query.postidx
    // const page = req.query.page || 1  
    // const perPage = req.query.per_page || 10
    const viewCommentResult = {
        "success": false,
        "message": "",
        "data": null
    }
    const client = await pool.connect()
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.")

        const sql = "SELECT account_idx, content from comment WHERE post_idx=$1 ORDER BY idx OFFSET 0  LIMIT 20"
        const values = [postIdx]
        const data = await client.query(sql, values)
        

        if (data.rowCount > 0) {
            viewCommentResult.success = true
            viewCommentResult.data = data.rows
        }
        else {
            viewCommentResult.success = true
            viewCommentResult.message = "아직 댓글이 없습니다."
        }
    }
    catch (e) {
        viewCommentResult.message = e.message
    }
    finally {
        if(client) client.release()
        res.send(viewCommentResult)
    }
})

//댓글 수정
router.put("/:commentidx", async (req, res) => {
    const contentIdx = req.params.commentidx
    const {comment} = req.body
    const editCommentResult = {
        "success": false,
        "message": ""
    }
    const client = await pool.connect()
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.")
        const idx = req.session.user.idx
    
        exception.commentCheck(comment)

        const sql = "UPDATE comment SET content=$1 WHERE idx=$2 AND account_idx=$3"
        const values = [comment, contentIdx, idx]
        const data = await client.query(sql, values)
        
        if (data.rowCount === 0) throw new Error ("댓글수정 실패")
        editCommentResult.success = true
    }
    catch (e) {
        editCommentResult.message = e.message
    }
    finally {
        if(client) client.release()
        res.send(editCommentResult)
    }
})

//댓글 삭제
router.delete("/:commentidx", async (req, res) => {
    const contentIdx = req.params.commentidx
    const deleteCommentResult = {
        "success": false,
        "message": ""
    }
    const client = await pool.connect()
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.")
        const idx = req.session.user.idx
        
        const sql = "DELETE FROM comment WHERE idx=$1 AND account_idx=$2"
        const values = [contentIdx, idx]
        const data = await client.query(sql, values)
        
        if (data.rowCount === 0) throw new Error ("댓글삭제 실패")
        deleteCommentResult.success = true
    }
    catch (e) {
        deleteCommentResult.message = e.message
    }
    finally {
        if(client) client.release()
        res.send(deleteCommentResult)
    }
})

module.exports = router