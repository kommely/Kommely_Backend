const crypto = require("crypto");

class Encryption {
  static encryptData(data) {
    const key = crypto.randomBytes(32); // 256-bit key for AES-256
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { encrypted, key, iv }; // Store key and IV securely
  }

  static decryptData(encryptedData, key, iv) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}

module.exports = Encryption;
