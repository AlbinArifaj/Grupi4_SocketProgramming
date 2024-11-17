export default function restrict_access(matchWord){
    let arr = ["client.js","decrypt.js","encrypt.js","index.html","package.json","package-lock.json","README.md","send_message.html","server.js"];


    for (let i=0;i<arr.length;i++){
        if (matchWord===arr[i]){
            return true;
        }
    }

}


