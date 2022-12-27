const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const fs = require("fs");

const keys_require = 4;
let privateKeys = {};
function createKeys(limit){
    let addresses = {};
    let index = 0;
    try{
        while (index < limit){
            const privateKey = toHex(secp.utils.randomPrivateKey());
            const publicKey = toHex(secp.getPublicKey(privateKey));
            addresses[publicKey] = index + 1;
            privateKeys[privateKey] = publicKey;
            index++;
        }
        console.log(`${index} address(es) Succefully generated!!!`);
    } catch(error){
        console.log(`Oh no! something went wrong ${error}`);
    }
    return addresses;
}

async function addressInFile(){
    fs.writeFileSync("../address.json", JSON.stringify(createKeys(keys_require)), "utf-8");
    fs.writeFileSync("./.env", JSON.stringify(privateKeys), "utf-8");
}

addressInFile();