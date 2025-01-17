import { createSignature, verifySignature, generateKey } from "./signatures.js";
import { post } from "./mock-requests.js";

/**
 * FORM SENDER (forms-runner)
 */
// Generate a key pair. In prod this would be generated outside of the application.
// The public key is shared with the consumers, the private key stays with us.
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

console.log("Here's what the request will look like", request);

/**
 * FORM CONSUMER (my-backend-api) - VALID SIGNATURE
 */
const isValid = verifySignature(publicKey, signature, request.body);
console.assert(isValid == true) // it matches as expected

/**
 * FORM CONSUMER (my-backend-api) - INVALID SIGNATURE
 */
requestPayload.context.state.applicantsName = "my malicious beneficiary";
requestPayload.context.state.doYouWantFreeMoney = "yes";

const isValid2 = verifySignature(publicKey, signature, request.body);
console.assert(isValid2 == false) // we've modified the payload, the signature shouldn't match

console.log("All worked!");
