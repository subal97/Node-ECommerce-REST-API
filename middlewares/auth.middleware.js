const expressAsyncHandler = require("express-async-handler");
const { validateJWT } = require("../config/jwtService");
const userModel = require("../models/userModel");


const authenticate = expressAsyncHandler(async(req, res, next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        res.status(403).send({
            message: 'Invalid JWT token'
        });
        return;
    }

    let validationResult =  await validateJWT(token);
    if(!validationResult.success){
        throw new Error(validationResult.error);
    }

    req.user = await userModel.findOne({email : validationResult.email});
    next();
});

const isAdminUser = expressAsyncHandler(async function(req, res, next){
    const roles = req.user?.roles;
    if(!roles.includes('admin')){
        throw new Error('Unauthorized access');
    }
    next();
});

module.exports = {
    authenticate,
    isAdminUser,
}