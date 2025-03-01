const crypto = require("crypto");

class Encryption {
  static encryptData(data) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return {
      encrypted,
      key: key.toString("hex"),
      iv: iv.toString("hex"),
    };
  }

  static decryptData(encryptedData, key, iv) {
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
