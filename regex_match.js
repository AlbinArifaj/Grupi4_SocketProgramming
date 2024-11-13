export default function regex_match(matchWord){
    let arr = [/^\/createNewFolder\s+(.+)$/,/^\/removeFolder\s+(.+)$/];


    for (let i=0;i<arr.length;i++){
        if (matchWord.matches[arr[i]]){
            return matchWord.match(arr[i])
        }
    }

}


