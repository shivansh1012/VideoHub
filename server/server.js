const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

//cors
app.use(cors({
    origin: true,
    credentials: true,
}));

//logging middleware
let requestLogger = (req, res, next) => { 
    let method = req.method;
    let url = req.url;
    
    let log = `${method}:${url}`;
    console.log(log);
    next();
};

app.use(requestLogger);

//Links
app.use("/video", require("./VideoService/video.router.js"));
app.use("/meta", require("./MetaDataService/metadata.router.js"));

app.use("*", (req, res) => res.status(404).json({ message: "link not found" }));

module.exports = app;