const jwt = require('jsonwebtoken');
const { generateErrorResponse } = require('../utils/responseParser');
const errorMessages = require('../errorMessages');

module.exports = (req, res, next) => {
    try {
        const authHeaders = req.headers["authorization"];
        const [scheme, token] = authHeaders.split(" ");

        if (scheme !== 'Bearer') next();

        if (!token)
            return res.status(401).send(generateErrorResponse(errorMessages.unauthorized()));            

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err)
                return res.status(403).send(generateErrorResponse(errorMessages.forbidden()));

            req.httpContext.user = payload;
            next();
        });

    } catch (err) {
        console.log(err)
        return res.status(500).send(generateErrorResponse(err));
    }
}
