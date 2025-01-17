import crypto from "crypto";

export function generateKey() {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
}

/**
 * Create a signature for the given data using the provided private key.
 * @param {crypto.KeyObject} privateKey
 * @param {any} data
 * @returns {string}
 */
export function createSignature(privateKey, data) {
  const contentToSign = JSON.stringify(data);

  // Create a signature
  const sign = crypto.createSign("SHA256");
  sign.update(contentToSign);
  sign.end();

  return sign.sign(privateKey, "base64");
}

export function verifySignature(publicKey, signature, data) {
  const contentToVerify = JSON.stringify(data);

  const verify = crypto.createVerify("SHA256");
  verify.update(contentToVerify);
  verify.end();

  return verify.verify(publicKey, signature, "base64");
}
