import 'dotenv-flow/config';

import debug from "debug";
import http from "http";
import config from "./appsettings.js";
import startup from "./startup.js";

async function main() {
    try {
        const app = await startup(config);
        http.createServer(app).listen(config.port, () => {
            console.log(`Listening port: ${config.port}`);
            debug(`Listening port: ${config.port}`);
        });
    } catch (e) {
        console.error(e);
        debug("ERROR", e);
    }
}

main();

// import { onRequest } from 'firebase-functions/v2/https';
// import startup from './startup.js';
// import config from './appsettings.js';

// export const api = await (async function() {
//     const app = await startup(config);

//     return onRequest(app);
// })()