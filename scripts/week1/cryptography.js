require('dotenv').config();
const { assert, expect } = require('chai');
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MESSAGE = "hello word";

function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
}

async function signMessage(msg) {
    const messageHash = hashMessage(msg);
    // the 3rd optinon paramter recovered is true will return recoverBit for veritying
    return secp.sign(messageHash, PRIVATE_KEY, { recovered: true });
}

async function recoverKey(message, signature, recoveryBit) {
    // hash message
    const messageHash = hashMessage(message);
    // recover the public key by passing in the hash message, signature, and recovery bit
    return secp.recoverPublicKey(messageHash, signature, recoveryBit);
}

/**
 * 1.the first byte is compressed format or not, slice off the first byte
 * 2.hash of the rest of the public key
 * 3.take the last 20 bytes of hash bytes
 * 4.hax the last 20 bytes to address
 * 
 * @param {*} publicKey Uint8Array
 * @returns 
 */
function getAddress(publicKey) {
    // console.log(publicKey)
    // console.log(publicKey.slice(1))
    // console.log(keccak256(publicKey.slice(1)))
    // console.log(keccak256(publicKey.slice(1)).slice(-20))
    return toHex(keccak256(publicKey.slice(1)).slice(-20));
}

async function testCrytography() {
    const [signature, recoverBit] = await signMessage(MESSAGE)
    const publicKeyHex = toHex(secp.getPublicKey(PRIVATE_KEY));
    const revoveryKeyHex = toHex(await recoverKey(MESSAGE, signature, recoverBit));
    const address = getAddress(secp.getPublicKey(PRIVATE_KEY));
    console.log("0x" + address);
    assert(publicKeyHex, revoveryKeyHex);
}

testCrytography();