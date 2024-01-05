//Import
const router = require("express").Router()
const pool = require("../database/postgreSql")
const exception = require("../modules/exception")

//Apis
//댓글 업로드
router.post("/", async (req, res) => {
    const postIdx = req.query.postidx
    const {comment} = req.body
    const uploadCommentResult = {
        "message": ""
    }
    try {
        if (!req.session.user) {
            const e = new Error("세션에 사용자 정보 없음")
            e.status = 401     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
            throw e
        }
        const idx = req.session.user.idx

        exception.commentCheck(comment)

        const sql = "INSERT INTO comment (post_idx, account_idx, content) VALUES ($1, $2, $3)"
        const values = [postIdx, idx, comment]
        const data = await pool.query(sql, values) //동작결과가 들어감

        if (data.rowCount === 0)  throw new Error("댓글 업로드 실패")  //굳이
        res.status(200).send(uploadCommentResult)
    }
    catch (e) {
        uploadCommentResult.message = e.message
        res.status(400).send(uploadCommentResult)
    }
})

//댓글 보기
//페이지네이션
router.get("/", async (req, res) => {
    const postIdx = req.query.postidx
    const viewCommentResult = {
        "message": "",
        "data": null
    }
    try {
        if (!req.session.user) {
            const e = new Error("세션에 사용자 정보 없음")
            e.status = 401     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
            throw e
        }

        const sql = "SELECT account.id, comment.* from comment JOIN account ON comment.account_idx = account.idx WHERE post_idx=$1 ORDER BY idx"
        const values = [postIdx]
        const data = await pool.query(sql, values)

        if (data.rowCount > 0) {
            viewCommentResult.data = data.rows
            res.status(200).send(viewCommentResult)
        }
        else {
            viewCommentResult.message = "아직 댓글이 없습니다."
            res.status(200).send(viewCommentResult)
        }
    }
    catch (e) {
        viewCommentResult.message = e.message
        res.status(400).send(viewCommentResult)
    }
})

//댓글 수정
router.put("/:commentidx", async (req, res) => {
    const contentIdx = req.params.commentidx
    const {comment} = req.body
    const editCommentResult = {
        "message": ""
    }
    try {
        if (!req.session.user) {
            const e = new Error("세션에 사용자 정보 없음")
            e.status = 401     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
            throw e
        }
        const idx = req.session.user.idx
    
        exception.commentCheck(comment)

        const sql = "UPDATE comment SET content=$1 WHERE idx=$2 AND account_idx=$3"
        const values = [comment, contentIdx, idx]
        const data = await pool.query(sql, values)
        
        if (data.rowCount === 0) throw new Error ("댓글수정 실패")
        res.status(200).send(editCommentResult)
    }
    catch (e) {
        editCommentResult.message = e.message
        res.status(400).send(editCommentResult)
    }
})

//댓글 삭제
router.delete("/:commentidx", async (req, res) => {
    const contentIdx = req.params.commentidx
    const deleteCommentResult = {
        "message": ""
    }
    try {
        if (!req.session.user) {
            const e = new Error("세션에 사용자 정보 없음")
            e.status = 401     //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다.
            throw e
        }
        const idx = req.session.user.idx
        
        const sql = "DELETE FROM comment WHERE idx=$1 AND account_idx=$2"
        const values = [contentIdx, idx]
        
        if (data.rowCount === 0) throw new Error ("댓글삭제 실패")
        res.status(200).send(deleteCommentResult)
    }
    catch (e) {
        deleteCommentResult.message = e.message
        res.status(400).send(deleteCommentResult)
    }
})

module.exports = router