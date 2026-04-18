import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDataSource } from "@/database/db";
import { Room } from "@/database/entities/Room";
import { getStreamToken } from "@/actions/getstream";
import RoomView from "./_components/RoomView";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  const user = await getSession();
  if (!user) redirect("/login");

  const ds = await getDataSource();
  const room = await ds.getRepository(Room).findOne({ where: { callId: roomId } });
  if (!room) notFound();

  const isHost = room.userId === user.id;
  const token = await getStreamToken(user.id, user.name);

  return (
    <div className="h-full">
      <h1 className="sr-only">{isHost ? "Hosting" : "Watching"} room {roomId}</h1>
      <RoomView
        callId={roomId}
        callType={room.callType}
        isHost={isHost}
        userId={user.id}
        userName={user.name}
        token={token}
        apiKey={process.env.GETSTREAM_API_KEY!}
      />
    </div>
  );
}
