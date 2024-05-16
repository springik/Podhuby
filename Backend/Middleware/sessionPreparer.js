const express = require('express')

module.exports = function userSessionCheck(req, res, next) {
    if(!req.session.data) {
        //req.session.data = {}
    }
    next()

}