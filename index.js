var express = require("express");
const mysql = require('mysql');

var app = express();

var pool = mysql.createPool({
    socketPath:'/cloudsql/medicineapi:europe-central2:medicinedbinstance',
    database: 'questions',
    user:'username',
    password:'',
}) 

app.get("/", (req, res, next) => {

    
    const query = "SELECT * FROM questions"
    
    pool.query(query, [] , (error, result)=>{
        if(error) throw error
        if(!result[0]){
            res.json({status:"not found!"})
        }
        else{
            res.json(result[0])
        }
    })
   
});



app.listen(800, () => {

 console.log("Server running on port 800");

});

