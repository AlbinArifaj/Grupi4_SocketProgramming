import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();
const algorithm = process.env.ALGORITHM;
const secretKey = process.env.SECRET_KEY;
export default function aesDecrypt(encryptedHex){
    const encryptedBuffer= Buffer.from(encryptedHex,"hex")
    const iv= encryptedBuffer.slice(0,16);
    const content  = encryptedBuffer.slice(16);


    const decipher = crypto.createDecipheriv(algorithm,secretKey,iv);
    const decrypted=Buffer.concat([decipher.update(content),decipher.final()])
    return decrypted.toString("utf8");
}
