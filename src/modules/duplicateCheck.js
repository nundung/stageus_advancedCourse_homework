// import 
const client = require('../../psql')
const duplicate = {}

//아이디 중복체크
duplicate.idCheck = async(id, res) => {
    try {
        const sql = "SELECT * FROM account WHERE id=$1" //물음표 여러개면 $1, $2, $3
        const values = [id]
        const data = await client.query(sql, values)

        if (data.rows.length > 0) {
            return "아이디가 이미 존재합니다."
        }
        else {
            return null; // 중복되지 않는 경우
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
}

//이메일 중복체크
duplicate.emailCheck = async(email, res) => {
    try {
        const sql = "SELECT * FROM account WHERE email=$1" //물음표 여러개면 $1, $2, $3
        const values = [email]
        const data = await client.query(sql, values)

        if (data.rows.length > 0) {
            return "이메일이 이미 존재합니다."
        }
        else {
            return null; // 중복되지 않는 경우
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
}

module.exports = duplicate;