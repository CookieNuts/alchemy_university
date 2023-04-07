const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    // add transaction to mempool
    mempool.push(transaction);
}

function mine() {
    const lastBlock = blocks[blocks.length - 1];
    let newBlock = new Object();
    if (lastBlock === undefined) {
        newBlock.id = 0;
    } else {
        newBlock.id = lastBlock.id + 1;
    }
    // the maximum tx limit on block
    newBlock.transactions = mempool.splice(0, MAX_TRANSACTIONS);

    // attemp to hash start with nonce 0
    for (let nonce = 0; ; nonce++) {
        newBlock.nonce = nonce;
        let hash = SHA256(JSON.stringify(newBlock));
        if (BigInt(`0x${hash}`) < TARGET_DIFFICULTY) {
            newBlock.hash = hash;
            break;
        }
    }

    console.log(newBlock);
    blocks.push(newBlock);
}

mine();