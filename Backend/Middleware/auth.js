const express = require('express')

module.exports = function auth(req, res, next) {
    console.log('authing...');
    console.log(req.path);

    if(!req.session.user)
        return res.status(401).json({ message: 'Try logging in!' })
    if(req.session.user.permision_level != 'admin' && req.baseUrl.includes('/admin'))
        return res.status(403).json({ message: 'Unsificient permision' })

    next()
}