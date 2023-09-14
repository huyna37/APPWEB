const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const appPure = require('./routes/AppPure')
// Static Middleware
const corsOptions = {
    origin: "*",
};
// Allow Cross-Origin requests
app.use(cors(corsOptions));

// Set security HTTP headers
app.use(helmet());
// Limit request from the same API

app.use(
    express.json({
        limit: "15kb",
    })
);

const allowedDomains = ['https://truyenvui.online', 'http://localhost:8080'];

app.use((req, res, next) => {
    const referer = req.headers.referer || req.headers.origin;

    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Định tuyến đến trang chủ
app.use("/app", appPure);

mongoose
    .connect(
        "mongodb://127.0.0.1/truyenvui"
    )
    .then(async () => {
        console.log("Kết nói tc!!");
    });

String.prototype.isObjectString = (value) => {
    try {
        const obj = JSON.parse(value);
        return typeof obj === "object" && obj !== null;
    } catch (error) {
        return false;
    }
};
// Khởi động máy chủ
app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION!!!  shutting down ...");
    console.log(err.name, err.message);
});
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION!!! shutting down...");
    console.log(err.name, err.message);
});
