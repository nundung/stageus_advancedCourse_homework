//Import
const router = require("express").Router()
const client = require('../../psql')
const exception = require('../modules/exception')
const duplicate = require('../modules/duplicateCheck')

//Apis
//게시물 목록(게시판)
router.get("/", async (req, res) => {
    const postBoardResult = {
        "success": false,
        "message": "",
        "data": null
    }
    try {
        if (!req.session.user) throw new Error("세션에 사용자 정보가 없습니다.");
        const idx = req.session.user.idx;
        
        //db에 값 입력하기
        const sql = "SELECT * FROM post ORDER BY idx DESC"
        const data = await client.query(sql, values)
        
        if (data.rows.length === 0) throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.")
        
            if (results.length > 0) {
                postBoardResult.success = true
                postBoardResult.data = results
                res.send(postBoardResult)
            }
    }
    catch {

    }
})