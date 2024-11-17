import dgram from "dgram";
import express from "express";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();
import aesDecrypt from "./decrypt.js";
import open from "open";


const server = dgram.createSocket("udp4");
import restrict_access from "./restrict_access.js";

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
        {regex: /^\/createFolder\s+(.+)$/, name: 'createNewFolder'},
        {regex: /^\/readFolder\s+(.+)$/, name: 'readFolder'},
        {regex: /^\/removeFolder\s+(.+)$/, name: 'removeFolder'},
        {regex: /^\/createFile\s+(.+)$/, name: 'createFile'},
        {regex: /^\/openFile\s+(.+)$/, name: 'openFile'},
        {regex: /^\/readFile\s+(.+)$/, name: 'readFile'},
        {regex: /^\/writeFile\s+(.+)$/, name: 'writeFile'},
        {regex: /^\/renameFile\s+(.+)$/, name: 'renameFile'},
        {regex: /^\/removeFile\s+(.+)$/, name: 'removeFile'},


    ];
    let matchFound = false;
    regexArray.forEach(({regex, name}) => {
        const match = aesDecrypt(msg).match(regex);
        if (match) {
            matchFound = true;
            let message = "";
            const folderName = match[1].substring(0);
            if (restrict_access(folderName)){
                message = new Buffer("You can't change the content of these files or read the content of these files pls try something else")
            }else {
                switch (name) {
                    case "createNewFolder":

                        if (!fs.existsSync(folderName)) {
                            fs.mkdirSync(folderName, {recursive: true});
                        }
                        message = new Buffer("Folder Created " + folderName);

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
                        } else {
                            console.log("Folder Doesn't Exist");
                        }
                        break;

                    case "removeFolder":

                        if (fs.existsSync(folderName)) {
                            const isFolders = fs.lstatSync(folderName);
                            if (isFolders.isDirectory()) {
                                if (folderName !== "public" && folderName !== "node_modules") {
                                    fs.rmdirSync(folderName, {recursive: true, force: true});
                                }
                                message = new Buffer("Folder Deleted " + folderName);
                            } else {
                                message = new Buffer(folderName + " it's not a folder");

                            }
                        } else {
                            message = new Buffer("Folder Doesn't Exist");

                        }
                        break;

                    case "createFile":

                        fs.createWriteStream(folderName);
                        message = "File Created " + folderName;
                        break;

                    case "openFile":

                        if (fs.existsSync(folderName)) {

                            open(folderName).then(() => {
                            }).catch((err) => {
                                console.log(err);
                            })
                            message = "File Opened " + folderName;
                        }
                        break;

                    case "readFile":
                        if (fs.existsSync(folderName)) {

                            const res = fs.openSync(folderName, 'r')
                            const buffer = Buffer.alloc(1024);
                            fs.readSync(res, buffer, 0, buffer.length, 0)
                            message = buffer;
                            fs.closeSync(res)
                        }

                        break;

                    case "writeFile":
                        const [fileName, text] = folderName.split(' ', 2);
                        fs.appendFileSync(fileName, text, {encoding: "utf8", flag: "a"})
                        break;
                    case "renameFile":
                        const [oldName, newname] = folderName.split(' ', 2);
                        if (fs.existsSync(oldName)) {

                            fs.renameSync(oldName, newname);
                        } else {
                            message = "Directory doesn't exist";
                        }
                        break;
                    case "removeFile":
                        if (fs.existsSync(folderName)) {
                            fs.unlinkSync(folderName);
                        }else{
                            message=new Buffer("File doesn't exist");
                        }
                }
            }

            if (message !=="") {
                server.send(message, ringo.port, ringo.address, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
            }
        });
        if (!matchFound) {
            console.log(msg.toString("hex"))
        }
    
    })
    server.bind(PORT,IP_ADDRESS);
