import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();
const algorithm = process.env.ALGORITHM;
const secretKey = process.env.SECRET_KEY;

export default function aesEncrypt(content){
    const iv =crypto.randomBytes(16);
    const cipheriv =crypto.createCipheriv(algorithm,secretKey,iv);
    const encrypted= Buffer.concat([cipheriv.update(content),cipheriv.final()]);
    return Buffer.concat([iv,encrypted]);
}


