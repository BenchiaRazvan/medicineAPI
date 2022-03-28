var express = require("express");
const mysql = require('mysql');

const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config();

const CREDENTIALS = {"type": "service_account","project_id": "medicineapi","private_key_id": "d5aba7246309abb15de548a6f2a232ffc5670524","private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpAWkptT+/Wtkf\npxJBEVPHyc7eyeBhKKLvL6lMTNXX0jACEwGUd0Per11e9xtXtwVzN5q2MLX9+8K6\n/EgLNacYiuv/xCxVhRLTPZDZHGb62kkw7AaQItGgjC0hMQVYwlbZ9OaL1Mf0grgV\nAqtHQoMoM86z497a+NUUMuTG+Ba1LwOnXtbHFqYJwp5XU+tGjmxrjCFbEinEjcQI\ntSnmKi/Ge9fqGWjcOpE3r76XMMSowys9HVZScXN8q6yGeBEwE8hBVuSpJ83uJ/Fz\n9y0cfzCWKbv3j6PLXVvrOuk1Fw434WQ9UI+SaXJpJfFTRRhHidcg1eUamilzzfzA\nQQ2220zdAgMBAAECggEAB6iytVsramaZlF+j6iL44wL4RwxrCLwotiI4z+ZjgoZZ\n+p4V4j6NatgTqSwVpyH6M0B/2GXYuYvhRUwNj8R8sBYLn+mqAK4pLj2KBOzOleuy\niW8I1Rte2KHBodFw5pbYDMSWdhvMe/44jWszi+UtwHKomWpoPRAtx96Ok53GmatW\n2K3c4SsOOjDON77UQhCSv90I9xZdyBceNicmvHgUr5jwhB+20KBhwjgTQ48VVgS+\nl/ebMXsiXciKg4CpHdXJGPz0Rdcf7taxIIurHNUpqlSrVYmivwGDUWwQxuwutS90\np3aYRm4p4Xc2ctYzN30dUXZcZLlQuNcdMIZ5jowyQQKBgQDiyJBM9tlRKADV2fx1\nKCqFQQUt08bvXNzNL7tgdJrP3jHE9UViJWhQHgSL1Wus2e4ty8dtC4R20dL/ZQ/4\nH7yY3CAuwMneZjvlSzKGubGOfG2QZipzlqFUhSVAD8Uxc3iUoPEkCv7sIpzeUeZ3\nzKWwu2cqqqLwuoBvXY36Gj1rCQKBgQC+x0zwTAWHdQ/XRIjv6/sE87m8Ljm95lIf\nmDY4JqwQdos6V5aTAr4NKK5Yir9TtHME93Av3Qy4UlTxvPleqrmKLbMRYOt85PWI\nLH3/0D9eOOitA/OO9ysxYafUrOiQR8HHQcKRMbM/HDScOVc1n+03leblnSg6bzBq\na916RLgENQKBgQCnrTNENJ+pabJ0a6BF31TRAaoaoCLOiBKZg1k/j/eHCfoybkbG\nsnHWCtvBqCLcwqVgJvNkpMdkMu+W9dpA0vZW7yq8Zr7bOSu/9UF+a33kpAs+YMuy\newT9wRQxsXdTgNT+z6B7zcV+QnlJx7Rnj2BSs70rxs6CvuKHdNystwoCQQKBgEan\n6YbVoPaaFFPVviGddEpROejH9fqu4ptw9CO3ruIqBUaGSe4Ihfq5pliEinelzTN5\nsMMJSzy4wV0GcBTvhef3JOq6ynxnD8hvMfscVVvAF+x8GihIwmZ3lIDfyQImkU4K\nvNSpY4lsGNADLJlfsat0iR9hJRT/OR8w88XkzYJBAoGAUcGFemmrSivNbgzkUwdK\nLA67weEakE/sVUyBcgSmQ7kYxT3e1V1O63zo3j4miJI3xlY18o6eQt0bZz5jte18\ntk1umv9beWVDECsPFIPnGIHPetdsx10SS7eczUfLmTcG2kP5kldt3takgc8kFzSF\nggud8GdTi818KImHH9N8XOw=\n-----END PRIVATE KEY-----\n","client_email": "asd123@medicineapi.iam.gserviceaccount.com","client_id": "116320896372826377897","auth_uri": "https://accounts.google.com/o/oauth2/auth","token_uri": "https://oauth2.googleapis.com/token","auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/asd123%40medicineapi.iam.gserviceaccount.com"}

const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

const translateText = async (text, targetLanguage) => {

    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
};



var app = express();

var pool = mysql.createPool({
    host:'34.116.183.91',
    socketPath:'/cloudsql/medicineapi:europe-central2:medicinedbinstance', // comment this when running locally
    database: 'questions',
    user:'root',
    password:'1234',
}) 

app.get("/", (req, res, next) => {

    const query = "SELECT * FROM questions"
    
    pool.query(query, [] , (error, result)=>{
        if(error) res.json({status:error.stack})
        else{
        if(!result[0]){
            res.json({status:"not found!"})
        }
        else{
            translateText(result[0].question_description, 'ro')
                .then((r) => {
                    res.json(r)
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    }
    })
   
});



app.listen(800, () => {

 console.log("Server running on port 800");

});

