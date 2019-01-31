const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) =>
{
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, global.gConfig.secret_key);

        userData = req.userData = {
            emailAddress: decodedToken.emailAddress,
            userId: decodedToken.userId
        };
        next();
    } catch (error) {
        return res.boom.badRequest(error);
    }
};

module.exports = checkAuth;