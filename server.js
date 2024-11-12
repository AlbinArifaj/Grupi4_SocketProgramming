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


