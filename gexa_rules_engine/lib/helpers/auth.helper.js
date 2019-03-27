var jwt = require('jsonwebtoken');

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_PUBLIC_ACCESS_KEY, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err);
            }
            resolve(decodedToken);
        });
    });
}

module.exports = {
    verifyJWTToken: verifyJWTToken
}