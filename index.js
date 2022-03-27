var express = require("express");
const mysql = require('mysql');

var app = express();


app.get("/", (req, res, next) => {
   
    res.send("Hello");
});



app.listen(800, () => {

 console.log("Server running on port 800");

});

