var express = require("express");
const mysql = require('mysql');

var app = express();


app.get("/", (req, res, next) => {
   
    res.send("Hello test3");
});



app.listen(800, () => {

 console.log("Server running on port 800");

});

