const {promisify} = require('util');
const jwt = require('jsonwebtoken');

const jwt_key = process.env.JWT_SECRET;
const jwt_expiry = process.env.JWT_EXPIRY || "1h";
const jwt_options = {
    expiresIn: jwt_expiry,
};

const createJWT = async(user) =>{
    let claims = {
        sub: user.email,
    };

    let token = await promisify(jwt.sign)(claims, jwt_key, jwt_options);
    return token;
};

const createRefreshToken = async(id) =>{
    let token = await promisify(jwt.sign)({id}, jwt_key, {expiresIn: "3d"});
    return token;
};

const validateJWT = async (token) => {
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, jwt_key);        
    } catch (error) {
        return {success: false, error : error};
    }
    return {success:true, email: decoded.sub};
}

module.exports = {
    createJWT, validateJWT, 
    createRefreshToken,
};