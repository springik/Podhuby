const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 8)
    return hashedPassword
}

module.exports = { hashPassword }