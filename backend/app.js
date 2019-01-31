const path = require("path");
const express = require("express");
const boom = require('express-boom-2');
const bodyParser = require("body-parser");
const i18n = require("i18n");
require("../config/config.js");

const mongoose = require("mongoose");
const userRoutes = require("./routes/user"); //USER ROUTE

const app = express();

// process.env.NODE_ENV = "development";

i18n.configure({
    locales: ['en'],
    directory: global.gConfig.rootPath + '/locales'
});
app.use(i18n.init);

mongoose.connect(global.gConfig.database, { useNewUrlParser: true }).then(() => {
    console.log("Connected to db");
}).catch(err => {
    console.error("Connection failed", err.message);
});

mongoose.set("useCreateIndex", true);
mongoose.set('debug', true);

app.use(boom());

app.use((req, res, next) => {
    request = req;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Origin,Accept, X-Requested-With, Content-Type, Accept,Access-Control-Request-Method, Authorization, Cache-Control, Key, Access-Control-Request-Headers,Access-Control-Allow-Origin"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );


    next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use("/api", userRoutes);

app.use("/index", (req,res) => {
    return res.status(200).json({ "Welcome": "To Index" });
});

app.use("/api/*", function (req, res) {
    res.boom.notFound();
});


app.use("*", function (req, res) {
    res.boom.notFound();
});
module.exports = app;