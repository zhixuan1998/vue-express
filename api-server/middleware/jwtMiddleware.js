import jwt from "jsonwebtoken";
import { generateErrorResponse } from "../utils/responseParser.js";
import errorMessages from "../errorMessages.js";
import config from "../appsettings.js";

const { verify, TokenExpiredError } = jwt;

export default function (req, res, next) {
    try {

        const authToken = req.headers["authorization"];

        const [authType, token] = authToken?.split(" ") ?? [];

        if (req.path === "/api/users/token" || authType !== "Bearer" || !token) {
            return next();
        }

        if (!token) return res.status(401).send(generateErrorResponse(errorMessages.unauthorized()));

        verify(token, config.security.accessTokenSecret, (err, payload) => {
            if (err instanceof TokenExpiredError)
                return res.status(401).send(generateErrorResponse(errorMessages.tokenExpired()));

            if (payload.fingerprint !== req.cookies.fingerprint) {
                return res
                    .status(401)
                    .clearCookie("refreshToken")
                    .clearCookie("fingerprint")
                    .send(generateErrorResponse(errorMessages.fingerprintMismatch()));
            }

            const user = {
                id: payload.id,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                dob: payload.dob
            };

            req.httpContext = { ...req.httpContext, user };

            next();
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(generateErrorResponse());
    }
}
