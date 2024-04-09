const jwt = require("jsonwebtoken");
const { generateErrorResponse } = require("../utils/responseParser");
const errorMessages = require("../errorMessages");
const config = require("../appsettings");

module.exports = (req, res, next) => {
    try {
        const authHeaders = req.headers["authorization"];

        if (authHeaders) {

            const [scheme, token] = authHeaders.split(" ");

            if (scheme === "Bearer") {

                if (!token) return res.status(401).send(generateErrorResponse(errorMessages.unauthorized()));

                jwt.verify(token, config.security.accessTokenSecret, (err, payload) => {
                    const tokenExpired = new Date(payload.expiredAt) < new Date();

                    if (err || tokenExpired) return res.status(403).send(generateErrorResponse(errorMessages.forbidden()));

                    const user = {
                        id: payload.id,
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        email: payload.email,
                        dob: payload.dob
                    };

                    req.httpContext = { ...req.httpContext, user };

                });
            }
        }

        next();

    } catch (err) {
        console.log(err);
        return res.status(500).send(generateErrorResponse());
    }
};
