const { pool } = require("../databases/postgreSql")

//댓글 업로드
const uploadComment = async (req, res, next) => {
    const postIdx = req.query.postidx
    const { comment } = req.body
    try {
        const authInfo = req.decoded
        const idx = authInfo.idx

        const sql = "INSERT INTO comment (post_idx, account_idx, content) VALUES ($1, $2, $3)"
        const values = [postIdx, idx, comment]
        await pool.query(sql, values)
        // if (data.rowCount === 0)  throw new Error("댓글 업로드 실패")  //굳이
        res.status(200).send()
    }
    catch (err) {
        next (err)
    }
}

//댓글 읽기
const readComment = async (req, res, next) => {
    const postIdx = req.query.postidx
    const result = { "data": null }
    try {
        const sql = 
        `SELECT account.id, comment.* 
        from comment JOIN account 
        ON comment.account_idx = account.idx
        WHERE post_idx=$1 ORDER BY idx`
        const values = [postIdx]
        const data = await pool.query(sql, values)

        if (data.rowCount > 0) {
            result.data = data.rows
            res.status(200).send(result)
        }
        else {
            res.status(200).send("아직 댓글이 없습니다.")
        }
    }
    catch (err) {
        next(err)
    }
}

//댓글 수정
const editComment = async (req, res, next) => {
    // 파라미터 : 특정 데이터를 조회하거나 수정할 때 사용
    const contentIdx = req.params.commentidx
    const {comment} = req.body
    try {
        const authInfo = req.decoded
        const idx = authInfo.idx

        const sql = "UPDATE comment SET content=$1 WHERE idx=$2 AND account_idx=$3"
        const values = [comment, contentIdx, idx]
        await pool.query(sql, values)
        res.status(200).send()
    }
    catch (err) {
        next(err)
    }
}

//댓글 삭제
const deleteComment = async (req, res, next) => {
    const contentIdx = req.params.commentidx
    try {
        const authInfo = req.decoded
        const idx = authInfo.idx
        
        const sql = "DELETE FROM comment WHERE idx=$1 AND account_idx=$2"
        const values = [contentIdx, idx]
        await pool.query(sql, values)
        
        res.status(200).send()
    }
    catch (err) {
        next(err)
    }
}
module.exports = { uploadComment, readComment, editComment, deleteComment }