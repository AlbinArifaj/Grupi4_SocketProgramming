import dgram from "dgram";
import express from "express";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();
import aesDecrypt from "./decrypt.js";
import open from "open";


const server = dgram.createSocket("udp4");
import regex_match from "./regex_match.js";

const IP_ADDRESS=process.env.IP_ADDRESS;
const PORT=process.env.PORT;


server.on("error", (err) => {
    console.error(err.stack);
    server.close();
})

server.on("listening", () => {
    console.log(`Listening on ${server.address().address} port ${server.address().port}`);
})

server.on("message",(msg,ringo)=> {
    // const command = msg.toString("utf8");
    const regexArray = [
        {regex: /^\/createNewFolder\s+(.+)$/, name: 'createNewFolder'},
        {regex: /^\/readFolder\s+(.+)$/, name: 'readFolder'},
        {regex: /^\/removeFolder\s+(.+)$/, name: 'removeFolder'},
        {regex: /^\/createFile\s+(.+)$/, name: 'createFile'},
        {regex: /^\/openFile\s+(.+)$/, name: 'openFile'},
        {regex: /^\/readFile\s+(.+)$/, name: 'readFile'}

    ];
    let matchFound = false;
    regexArray.forEach(({regex, name}) => {
        const match = aesDecrypt(msg).match(regex);

        if (match) {
            matchFound = true;
            let message = "";
            const folderName = match[1].substring(0);
            switch (name) {
                case "createNewFolder":
                    if (!fs.existsSync(folderName)) {
                        fs.mkdirSync(folderName, {recursive: true});
                    }

                    message = new Buffer("Folder Created " + folderName);
                    server.send(message, ringo.port, ringo.address, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                    break;
                case "readFolder":
                    if (fs.existsSync(folderName)) {
                        fs.readdir(folderName, (err, files) => {
                            files.forEach(file => {
                                server.send(file, ringo.port, ringo.address, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            })
                        })
                    }else{
                        console.log("Directory Doesn't Exist");
                    }
                    break;

                    
                    case "removeFolder":
                        if (fs.existsSync(folderName)) {
    
                            if (folderName !== "public" && folderName !== "node_modules") {
                                fs.rmdirSync(folderName, {recursive: true, force: true});
                            }
                            message = new Buffer("Folder Deleted " + folderName);
    
                        }else{
                            message = new Buffer("Folder Doesn't Exist");
    
                        }
                        break;
                    case "createFile":
                        fs.createWriteStream(folderName);
                        message = "File Created" + folderName;
                        break;
    
                    case "readFile":
                        console.log("here "+folderName);
                        fs.chmod(folderName,0o444,(err)=>{
    
                            open(folderName).then(()=>{
    
                            }).catch((err)=>{
                                console.log(err);
                            })
    
    
                            if (err){
                                console.log(err);
                            }
                        });
    
                        message = "File Opened " + folderName;
                        break;
                }
    
                server.send(message, ringo.port, ringo.address, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
    
            }
        });
        if (!matchFound) {
            console.log(aesDecrypt(msg.toString("hex")))
        }
    
    })
    server.bind(PORT,IP_ADDRESS);
