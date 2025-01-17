export function post(signature, body) {
  return {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      "X-Signature": signature,
    },
  };
}
