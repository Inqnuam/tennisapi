const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    apps: [
        {
            name: "Tennis API",
            script: "server.js",
            watch: process.env.NODE_ENV == "development" ? true : false,
            wait_ready: true,
            listen_timeout: 3000,
            kill_timeout: 3000,
            shutdown_with_message: true,
            error_file: "logs/err.log",
            out_file: "logs/out.log",
            log_date_format: "DD/MM HH:mm:ss Z",
            ignore_watch: ["ecosystem.config.cjs", "logs", "node_modules", "test", ".git", "/*/**/.DS_Store", ".DS_Store", "README.md", "config", "resources", ".env"],
        },
    ],
};
