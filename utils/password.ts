const bcrypt = require('bcrypt');
const saltRounds = 12;

// Hashes password
export async function hashPassword(plainTextPassword: string): Promise<string> {
    const hash: Promise<string> = await bcrypt.hash(plainTextPassword, saltRounds);
    return hash;
}

// Compares password and returns true or false
export async function checkPassword(userInput: string, storedHash: string): Promise<Boolean> {
    const isMatch: Promise<Boolean> = await bcrypt.compare(userInput, storedHash);
    return isMatch;
}
