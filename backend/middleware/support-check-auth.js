const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) =>
{
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, global.gConfig.secret_key);
        if(decodedToken.userCode == undefined || decodedToken.userCode != 'support' ){
            return res.boom.unauthorized("Invalid attempt");
        }
        userData = req.userData = {
            emailAddress: decodedToken.emailAddress,
            userId: decodedToken.userId,
            userCode: decodedToken.userCode
        };
        next();
    } catch (error) {
        return res.boom.badRequest(error);
    }
};

module.exports = checkAuth;