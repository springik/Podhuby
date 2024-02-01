const express = require('express')
const bcrypt = require('bcrypt')

module.exports = function passwordHasher(req, res, next) {
    console.log("original psw:" + req.body.userPassword)
    hashPassword(req.body.userPassword)
    .then((hashedPassword) => {
        req.body.userPassword = hashedPassword
        next()
    })
    .catch((err) => {
        console.log(err)
    })
}

const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 8)
    return hashedPassword
}