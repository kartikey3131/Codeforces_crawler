const cookie = require('cookie-parser');
const { response } = require('express');
const jwt = require('jsonwebtoken')

module.exports = function (req) {
    const token = req.cookies.auth_token;
    if(token===undefined){
        return undefined;
    }
    
    const decoded_token = jwt.verify(token,"Codeforces_Crawler");
    return decoded_token;
};