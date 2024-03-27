const helmet = require('helmet');
const express = require('express');
const winston = require('winston');
require('winston-mongodb').MongoDB;
const expressWinston = require('express-winston');
const { loadControllers, scopePerRequest } = require('awilix-express');
const { container, setup } = require("./container");

module.exports = async(config) => {
    const logger = expressWinston.logger({
        transports: [
            // new winston.transports.Console(),
            new winston.transports.MongoDB({
                db: config.mongodb.log,
                level: "info",
                capped: true,
                cappedSize: 100000,
                options: { useUnifiedTopology: true },
            })
        ],
        metaField: "metadata",
        requestWhitelist: ["body", "headers", "query", "method", "url"],
        responseWhitelist:  ["body", "statusCode", "error"]
    });

    var app = express();
    app.use(express.json());
    app.use(helmet());
    app.use(logger);
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();
    });

    app.use(scopePerRequest(container));
    app.use(loadControllers('src/*/*Controller.js', { cwd: __dirname }));

    // inject middlewares
    // app.use(require("./middleware/jwtMiddleware"));
    // app.use(require("./middleware/userMiddleware"));

    return app;
}