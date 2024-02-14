const jwt = require('jsonwebtoken');

const verifyJwt = (req, res, next) => {
    const token = req.hader("Authorization");

    if(!token){}
};