"use server";

import { StreamClient, UserRequest } from "@stream-io/node-sdk";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDataSource } from "@/database/db";
import { Room } from "@/database/entities/Room";

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

export async function joinRoomAction(_: unknown, formData: FormData) {
  const roomId = formData.get("roomId") as string;
  console.log("Room ID:", roomId);

  redirect(`/rooms/${roomId}`);
}

export async function getStreamToken(userId: string, userName: string): Promise<string> {
  await client.upsertUsers([{ id: userId, name: userName, role: "user" }]);
  return client.generateUserToken({ user_id: userId, validity_in_seconds: 60 * 60 });
}

export async function createRoomAction() {
  const user = await getSession();
  if (!user) redirect("/login");

  await client.upsertUsers([{ id: user.id, name: user.name, role: "user" }]);

  const roomId = crypto.randomUUID();
  const callType = "livestream";
  const call = client.video.call(callType, roomId);
  const createdCall = await call.getOrCreate({
    data: {
      created_by_id: user.id,
      members: [{ user_id: user.id, role: "admin" }],
    },
  });

  const ds = await getDataSource();
  const room = ds.getRepository(Room).create({
    callId: roomId,
    callCid: createdCall.call.cid,
    callType,
    userId: user.id,
  });
  await ds.getRepository(Room).save(room);

  return { roomId };
}
