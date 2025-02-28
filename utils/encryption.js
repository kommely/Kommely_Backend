const crypto = require("crypto");

class Encryption {
  static encryptData(data) {
    const key = crypto.randomBytes(32); // 256-bit key for AES-256
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    // Convert key and iv to hex strings for storage in MongoDB
    return {
      encrypted,
      key: key.toString("hex"), // Store as hex string
      iv: iv.toString("hex"), // Store as hex string
    };
  }

  static decryptData(encryptedData, key, iv) {
    // Convert key and iv from hex strings back to Buffer
    const keyBuffer = Buffer.from(key, "hex");
    const ivBuffer = Buffer.from(iv, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      keyBuffer,
      ivBuffer
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}

module.exports = Encryption;
