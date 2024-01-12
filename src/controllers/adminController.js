//Import
const { logModel } = require("../databases/mongoDb")
const { pool } = require("../databases/postgreSql")


const log = async (req, res, next) => {
    const sort = req.params.sort
    const startDate = req.params.startdate
    const endDate = req.params.enddate
    const id = req.params.id
    const api = req.params.api
    const result = { "data": null }
    try {
        const date = {
            requestedTimestamp: {
                $gte: startDate,
                $lte: endDate
            }
        }
        if (id) {
            date.id = id
        }
        if (api) {
            date.url = { $regex: new RegExp(`^/${api}`) }
        }
        let db
        if (sort == "asc") {
            db = await logModel.find(date).sort({ requestedTimestamp: 1 })
        }
        else {
            db = await logModel.find(date).sort({ requestedTimestamp: -1 })
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
    const sort = req.params.sort
    const startDate = req.params.startdate
    const endDate = req.params.enddate
    const result = { "data": null }
    try {
        // const date = {
        //     requestedTimestamp: {
        //         $gte: startDate,
        //         $lte: endDate
        //     }
        // }
        const sql = `SELECT * FROM account desc` 
        const data = await pool.query(sql)

        if (data.rowCount > 0) {
            result.data = data.rows
            res.status(200).send(result)
        }
        // else {
        //     res.status(200).send("유저 목록이 비어있습니다.")
        // }
    }
    catch (err) {
        console.log(err)
        next(err)
    }
}

const comment = async (req, res, next) => {
    const sort = req.params.sort
    const startDate = req.params.startdate
    const endDate = req.params.enddate
    const result = { "data": null }
    try {
        const date = {
            requestedTimestamp: {
                $gte: startDate,
                $lte: endDate
            }
        }
        let db
        if (sort == "desc") {
            db = await logModel.find(date).sort({ requestedTimestamp: -1 })
        }
        else if (sort == "asc") {
            db = await logModel.find(date).sort({ requestedTimestamp: 1 })
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