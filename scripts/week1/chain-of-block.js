const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(data) {
        this.data = data;
    }

    toHash() {
        return SHA256(JSON.stringify(this));
    }
}

class BlockChain {
    constructor() {
        this.chain = [];
    }

    addBlock(newBlock) {
        // calculate previousBlock hash and add to newBlock previousHash
        let lastBlock = this.chain[this.chain.length - 1];
        if (lastBlock !== undefined) {
            newBlock.previousHash = lastBlock.toHash();
        } else {
            newBlock.previousHash = null;
        }
        this.chain.push(newBlock);
    }

    isValid() {
        for (let index = this.chain.length - 1; index >= 0; index--) {
            const preBlock = this.chain[index - 1];
            let preBlockHash;
            let previousHash;
            if (preBlock !== undefined) {
                preBlockHash = preBlock.toHash().toString()
                previousHash = this.chain[index].previousHash.toString()
            } else {
                preBlockHash = null;
                previousHash = this.chain[index].previousHash;
            }

            // use hash.toString() to compare
            if (preBlockHash !== previousHash) {
                return false;
            }
        }
        return true;
    }
}