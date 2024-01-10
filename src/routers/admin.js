//Import
const router = require("express").Router()
const { logModel } = require("../databases/mongoDb")
const { isAdmin } = require("../middlewares/isSession")


//로그 목록 보기
router.get("/log",
    isAdmin,
    async (req, res, next) => {
        const result = { "data": null }
        try {
            const logs = await logModel.find({}) // 모든 로그를 불러옵니다.
            result.data = logs
            res.status(200).send(result)
        } 
        catch (err) {
            next(err)
        }
    }
)

//로그 목록 보기 (시간순)
router.get("/log/recent",
    isAdmin,
    async (req, res, next) => {
    const result = { "data": null }
    const is_admin = req.session.user.is_admin
    if (!is_admin) {
        const err = new Error("접근 권한이 없습니다.")
        err.status = 401         //클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않다. (인증X)
        return next(err)
    }
    try {
        const logs = await logModel.find({}).sort({ requestedTimestamp: -1 }) // 모든 로그를 불러옵니다.
        result.data = logs
        res.status(200).send(result)
    } 
    catch (err) {
        next(err)
    }
})

module.exports = router