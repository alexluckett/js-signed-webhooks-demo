import { createSignature, verifySignature, generateKey } from "./signatures.js";
import { post } from "./mock-requests.js";

/**
 * FORM SENDER (forms-runner)
 */
// Generate a key pair. In prod this would be generated outside of the application.
const { publicKey, privateKey } = generateKey();

// The payload we want to send to the user
const requestPayload = {
  context: {
    state: {
      applicantsName: "John Doe",
      applicantsAddress__line1: "10 Downing Street",
      applicantsAddress__line2: "Westminster",
      applicantsAddress__line3: "London",
      applicantsAddress__postcode: "SW1A 2AA",
      doYouWantFreeMoney: "no",
    },
  },
};

// Sign the request
const signature = createSignature(privateKey, requestPayload);

// Create the request
const request = post(signature, requestPayload);

/**
 * FORM CONSUMER (my-backend-api) - VALID SIGNATURE
 */
console.log("\n******\nLEGITIMATE REQUEST EXAMPLE\n******");
const isValid = verifySignature(publicKey, signature, requestPayload);

if (isValid) {
  console.log("Signature is valid. Processing data.");
} else {
  console.log("Signature is invalid. Rejecting request.");
}

/**
 * FORM CONSUMER (my-backend-api) - INVALID SIGNATURE
 */
console.log("\n******\nMALICIOUS REQUEST EXAMPLE\n******");

// tamper with the payload
requestPayload.context.state.applicantsName = "my malicious beneficiary";
requestPayload.context.state.doYouWantFreeMoney = "yes";

const isValid2 = verifySignature(publicKey, signature, requestPayload);

if (isValid2) {
  console.log("Signature is valid. Processing data.");
} else {
  console.log("Signature is invalid. Rejecting request.");
}
