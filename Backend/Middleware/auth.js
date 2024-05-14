const express = require('express')
const loginRouter = require('../routes/login')

module.exports = function auth(req, res, next) {
    console.log('authing...');
    console.log(req.path);
    if(!req.session.data?.user)
        return res.status(401).json({ message: 'Try logging in!' })
    if(req.path.includes('/admin') && req.session.data.user.permision_level !== 'admin')
        return res.status(403).json({ message: 'Unsificient permision' })

    next()
}