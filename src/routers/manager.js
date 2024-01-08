//Import
const router = require("express").Router()
const { logModel } = require("../databases/mongoDb")


//관리자 페이지
router.get("/", async (req, res, next) => {
    const result = { "data": null }
    const is_admin =req.session.user.is_admin
    if (!is_admin) {
        const err = new Error("접근 권한이 없습니다.")
        err.status = 401         //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다. (인증X)
        return next(err)
    }
    try {
        const logs = await logModel.find({}); // 모든 로그를 불러옵니다.
        result.data = logs
        res.status(200).send(result)
    } 
    catch (err) {
        next(err)
    }
})

module.exports = router