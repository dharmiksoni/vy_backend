var express = require("express");
var authRouter = require("./auth");
var hostRouter = require("./host");
// var bookRouter = require("./book");

var app = express();

app.use("/auth/", authRouter);
app.use("/host/", hostRouter);
// app.use("/book/", bookRouter);

module.exports = app;
