const express = require('express');

module.exports = function userSessionCheck(req, res, next) {
    if(!req.session.data) {
        req.session.data = {};
    }
    //TODO: query the db with the session id and incase a session is found that is valid load it into memory
    if(!req.session.data.user) {
        req.session.data.user = {
            Email: undefined,
            Name: undefined
        };
    }
    next();
}