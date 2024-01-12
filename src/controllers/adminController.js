//Import
const { logModel } = require("../databases/mongoDb")
const pool = require("../databases/postgreSql")


const log = async (req, res, next) => {
    const { sort, startdate, enddate, id, api } = req.query
    const result = { "data": null }
    try {
        const filter = {}

        if(startdate) {
            filter.requestedTimestamp = {
                $gte: startdate
            }
        }
        if (enddate) {
            filter.requestedTimestamp = {
                ...filter.requestedTimestamp,
                $lte: enddate,
            };
        }

        if (id) {
            filter.id = id
        }
        if (api) {
            filter.url = { $regex: new RegExp(`^/${api}`) }
        }
        let db
        if (sort == "asc") {
            db = await logModel.find(filter).sort({ requestedTimestamp: 1 })
        }
        else {
            db = await logModel.find(filter).sort({ requestedTimestamp: -1 })
        }

        result.data = db
        res.status(200).send(result)
    }
    catch (err) {
        console.log(err)
        next(err)
    }
}


const account = async (req, res, next) => {
    const { sort, startdate, enddate } = req.query
    const result = { "data": null }
    try {
        let sql = `SELECT * FROM account`
        if (startdate) {
            sql += " WHERE created_at >= $1"
        }
        if (enddate) {
            // startdate가 이미 존재하는 경우 AND로 연결
            sql += startdate ? " AND" : " WHERE"
            sql += " created_at <= $2"
        }
        if (sort) {
            sql += ` ORDER BY idx ${sort}`
        }

        console.log(sql)
        
        // 시작일과 종료일이 있는 경우에만 바인딩 매개변수 추가
        const values = startdate || enddate ? [startdate, enddate] : []

        const data = await pool.query(sql, values)

        if (data.rowCount > 0) {
            result.data = data.rows
            res.status(200).send(result)
        }
        else {
        res.status(200).send("유저 목록이 비어있습니다.")
        }
    }
    catch (err) {
        console.log(err)
        next(err)
    }
}

const comment = async (req, res, next) => {
    const { sort, startdate, enddate, id, api, postidx } = req.query
    const result = { "data": null }
    try {
        const sql = `SELECT * FROM account ORDER BY idx ${sort}` 
        const data = await pool.query(sql)

        if (data.rowCount > 0) {
            result.data = data.rows
            res.status(200).send(result)
        }

        result.data = db
        res.status(200).send(result)
    }
    catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports = { log, account, comment }