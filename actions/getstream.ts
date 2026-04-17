import { StreamClient, UserRequest } from "@stream-io/node-sdk";

const apiKey = process.env.GETSTREAM_API_KEY;
const secret = process.env.GETSTREAM_API_SECRET;

if (!apiKey || !secret) {
  throw new Error(
    "GETSTREAM_API_KEY and GETSTREAM_API_SECRET must be set in the environment variables.",
  );
}
const client = new StreamClient(apiKey, secret);

export async function generateUserToken() {
  const userId = "john";
  const newUser: UserRequest = {
    id: userId,
    role: "user",
    custom: {
      color: "red",
    },
    name: "John",
    image: "link/to/profile/image",
  };
  await client.upsertUsers([newUser]);

  // validity is optional (by default the token is valid for an hour)
  const vailidity = 60 * 60;

  const userToken = client.generateUserToken({
    user_id: userId,
    validity_in_seconds: vailidity,
  });

  console.log("User token generated successfully");
  console.log(userToken);
  return userToken;
}
