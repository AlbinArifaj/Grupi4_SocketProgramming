import dgram from "dgram";
import express from "express";
import bodyParser from "body-parser";


import aesEncrypt from "./encrypt.js"
import dotenv from 'dotenv';
dotenv.config();
const app = express();

const IP_ADDRESS=process.env.IP_ADDRESS;
const PORT=process.env.PORT;

const client  =dgram.createSocket("udp4");
app.use(bodyParser.urlencoded({extended:true}));



client.on("connect", ()=>{
    console.log("Connected");
})

app.post("/permission",(req,res)=> {
    if (req.body.increasePermission ==="hello") {

        res.sendFile("send_message.html",{root:"."});

        app.post("/send", (req, res) => {

            let message =aesEncrypt(req.body.message);

            client.send(message, 0, message.length, PORT, IP_ADDRESS, function (error, bytes) {
                if (error) {
                    throw error;
                }
            })
        })}else{
        res.sendFile("send_message.html",{root:"."});
        app.post("/send", (req, res) => {
            let message = new Buffer(req.body.message);

            const regexReadFile = /^\/readFolder\s+(.+)$/
            const match = req.body.message.match(regexReadFile);

            if (match){
                client.send(message, 0, message.length, PORT, IP_ADDRESS, function (error, bytes) {
                    if (error) {
                        throw error;
                    }
                })
            }else{
                console.log("You can Only Read");
            }

        })
    }
})


client.on("message" , (msg,rinfo)=>{
    const command = msg.toString("utf8");
    console.log(command);
})


app.listen(3000 ,(err)=>{
    if (err){
        console.log(err)
    }
    console.log("Listening on port 3000");
});
