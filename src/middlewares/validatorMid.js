const { validationResult } = require('express-validator')
const validator = require('validator')


const validatorErrorChecker = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
            errors: extractedErrors,
        });
    }
    next();
}


// const validatorErrorChecker = (req, res, next) => {
//     console.log("실행")
//     const errors = validationResult(req)
//     console.log(errors)
//     try {
//         if (!errors.isEmpty()) {
//             const e = new Error(errorMessages.requiredFields)
//             e.status = 409 
//             return next(e)
//         }
//         check('email').custom((value) => {
//             if (!validator.isEmail(value)) {
//                 throw new Error(errorMessages.invalidEmail);
//             }
//             return true;
//         }).run(req);
//         next()
//     } 
//     catch (err) {
//         next(err)
//     }
// }


module.exports =  { validatorErrorChecker }


        // const { email } = req.body
        // if (!validator.isEmail(email)) {
        // console.log(errors)
        //     const e = new Error(errorMessages.invalidEmail)
        //     e.status = 409
        //     e.type = 'invalidEmail'
        //     return next(e)
        // }
        // next()