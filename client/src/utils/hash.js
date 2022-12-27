import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";


function toHash(msg){
    const msgHash = keccak256(utf8ToBytes(JSON.stringify(msg)));
    return toHex(msgHash);
}
export default toHash;