module.exports = {
    port: 8080,
    mongodb: {
        default: "mongodb+srv://mongo19980126:OQl8QGURBbXWph4O@my-cluster.wzvaghm.mongodb.net/service",
        log: "mongodb+srv://mongo19980126:OQl8QGURBbXWph4O@my-cluster.wzvaghm.mongodb.net/service_log"
    },
    security: {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "",
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "",
    }
}