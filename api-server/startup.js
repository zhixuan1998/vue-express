import cors from "cors";
import helmet from "helmet";
import express from "express";
import winston from "winston";
import MongoDB from "winston-mongodb";
import cookieParser from "cookie-parser";
import expressWinston from "express-winston";
import { loadControllers, scopePerRequest, inject } from "awilix-express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { container, setup } from "./container.js";


import jwtMiddleware from "./middleware/jwtMiddleware.js";
import userMiddleware from "./middleware/userMiddleware.js";

export default async function (config) {
    const logger = expressWinston.logger({
        transports: [
            // new winston.transports.Console(),
            new winston.transports.MongoDB({
                db: config.mongodb.log,
                level: "info",
                capped: true,
                cappedSize: 100000,
                options: { useUnifiedTopology: true }
            })
        ],
        metaField: "metadata",
        requestWhitelist: ["body", "headers", "query", "method", "url"],
        responseWhitelist: ["body", "statusCode", "error"]
    });

    await setup();

    var app = express();
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(cookieParser());
    app.use(logger);
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();
    });

    // inject middlewares
    app.use(jwtMiddleware);
    // app.use(userMiddleware);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    app.use(scopePerRequest(container));
    app.use(loadControllers("src/*/*Controller.js", { cwd: __dirname }));

    app.get('/users', (req, res) => {
        res.send('Hello World!');
    });

    return app;
}
