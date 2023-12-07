const express = require('express');

module.exports = function (req, res, next) {
    if(!req.session.user.Email) {
        req.session.isLoggedIn = false;
        console.log('user not logged in');
    }
    else {
        req.session.isLoggedIn = true;
        console.log('user logged in');
    }
    next();
}