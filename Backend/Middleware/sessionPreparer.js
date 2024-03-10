const express = require('express')

//FIXME: REDO quering
module.exports = function userSessionCheck(req, res, next) {
    if(!req.session.data) {
        req.session.data = {}
    }
    next()

}