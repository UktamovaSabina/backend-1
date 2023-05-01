import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { createHash } from "crypto";

function read(fileName) {
    const data = readFileSync(resolve('database', fileName + '.json'), 'utf-8')
    return JSON.parse(data)
}

function write(fileName, data) {
    writeFileSync(resolve('database', fileName + '.json'), JSON.stringify(data, null, 4));
    return true;
}

function hashPassword(password) {
    const hash = createHash('sha256').update(password).digest('hex')
    return hash
}

export {
    read, write, hashPassword
}