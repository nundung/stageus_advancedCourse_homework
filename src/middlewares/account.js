//Import
const duplicate = require('./duplicateCheckMid')


const emailChangeCheck = async (req, res, next) => {
    const newEmail = req.body.email
    try {
        const currentEmail = req.session.user.email
        if (newEmail !== currentEmail) {
            duplicate.emailCheck
        }
        next()
    }
    catch (err) {
        return next(err)
    }
}
module.exports = { idCheck, pwCheck, emailChangeCheck }
