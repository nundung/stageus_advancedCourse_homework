//Import
const { logModel } = require("../databases/mongoDb")


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



module.exports = { log, logId }