const express = require('express');

module.exports = function userSessionCheck(req, res, next) {
    if(!req.session.user) {
        req.session.user = {
            Email: undefined,
            Name: undefined
        };
    }
    next();
}