//Import
const { logModel } = require("../databases/mongoDb")
const { pool } = require("../databases/postgreSql")


//로그목록 보기
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


//유저목록 보기
const account = async (req, res, next) => {
    const { sort, startdate, enddate } = req.query
    const result = { "data": null }
    try {
        const values = []
        let sql = "SELECT * FROM account"
        if (startdate) {
            values.push(startdate)
            sql += " WHERE created_at >= $1"
        }
        if (enddate) {
            values.push(enddate)
            // startdate가 이미 존재하는 경우 AND로 연결
            sql += startdate ? " AND" : " WHERE"
            sql += ` created_at <= $${values.length}`
        }
        if (sort) {
            sql += ` ORDER BY idx ${sort}`
        }
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


//댓글목록 보기
const comment = async (req, res, next) => {
    const { sort, startdate, enddate, id, api, postidx } = req.query
    const result = { "data": null }
    try {
        const values = []
        let sql = "SELECT * FROM comment"
        if (startdate) {
            values.push(startdate)
            sql += " WHERE created_at >= $1"
        }
        if (enddate) {
            values.push(enddate)
            // startdate가 이미 존재하는 경우 AND로 연결
            sql += startdate ? " AND" : " WHERE"
            sql += ` created_at <= $${values.length}`
        }
        if (sort) {
            sql += ` ORDER BY idx ${sort}`
        }

        const data = await pool.query(sql, values)

        if (data.rowCount > 0) {
            result.data = data.rows
            res.status(200).send(result)
        }
        else {
        res.status(200).send("댓글 목록이 비어있습니다.")
        }

    }
    catch (err) {
        console.log(err)
        next(err)
    }
}


//방문자수 목록 보기 (1시간)
const visitorHour = async (req, res, next) => {
    const result = {
        "message": "",
        "data": null
    }
    try {
        const VISITOR_HOUR_KEY = process.env.VISITOR_HOUR_KEY
        const sql = `SELECT * FROM ${VISITOR_HOUR_KEY} ORDER BY idx DESC`
        const data = await pool.query(sql)
        
        result.data = data.rows
        console.log(data)

        res.status(200).send(result)
    }
    catch (err) {
        next (err)
    }
}


//방문자 목록 보기 (하루)
const visitorDay = async (req, res, next) => {
    const result = {
        "message": "",
        "data": null
    }
    try {
        const VISITOR_DAY_KEY = process.env.VISITOR_DAY_KEY
        const sql = `SELECT * FROM ${VISITOR_DAY_KEY} ORDER BY idx DESC`
        const data = await pool.query(sql)
        
        result.data = data.rows
        res.status(200).send(result)
    }
    catch (err) {
        next (err)
    }
}
module.exports = { log, account, comment, visitorHour, visitorDay }