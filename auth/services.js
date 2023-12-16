const jwt = require('jsonwebtoken');

function generateJWT(user) {
    var token = jwt.sign(
        { sub: user.id, is_admin: user.isAdmin, iat: Math.floor(Date.now() / 1000) - 30 }, 
        process.env.SECRET_KEY,
        { algorithm: 'HS256', expiresIn: "7d" }
    );
    return token;
}

function decodeJWT(token) {
    const decoded_user = jwt.verify(token, process.env.SECRET_KEY );
    return decoded_user
}

module.exports = {generateJWT, decodeJWT}