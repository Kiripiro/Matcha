const jwt = require("jsonwebtoken");
const InvalidTokensController = require('../controllers/invalidTokenController');

module.exports = (req, res, next) => {
    try {
        const cookiesString = req.header("cookie") || "";
        const cookiesSplit = cookiesString.split('; ');
        const cookies = new Map();
        cookiesSplit.forEach(pair => {
        const [key, value] = pair.split('=');
        cookies.set(key, value);
        });

        const accessToken = cookies.get("accessToken");
        if (!accessToken) {
            const refreshToken = cookies.get("refreshToken");
            if (!refreshToken) {
                return res.status(401).send("Missing refreshToken");
            }
            return res.status(401).send("Missing accessToken");
        }

        if (!InvalidTokensController.checkInvalidAccessToken(accessToken)) {
            return res.status(403).send("Invalid token blacklisted.");
        }
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("error = " + error);
        if (error.name === "TokenExpiredError")
            return res.status(401).send("Token expired");
        res.status(400).send("Invalid token");
    }
};
