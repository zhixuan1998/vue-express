const crypto = require("crypto");

crypto.createHash("sha256").update("e-commerce application").digest("hex");

function encrypt(message, key, iv) {
    let cipher = crypto.createCipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
    let encrypted = cipher.update(message, "utf-8", "hex");
    return encrypted + cipher.final("hex");
}

function decrypt(message, key, iv) {
    let decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(message, "hex", "utf-8");
    return decrypted + decipher.final("utf-8");
}

module.exports = {
    encrypt,
    decrypt
};
