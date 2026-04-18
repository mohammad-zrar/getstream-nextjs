export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  return (
    <div className="h-full flex items-center justify-center bg-muted/40 px-4">
      <h1 className="text-2xl font-bold">Room ID: {roomId}</h1>
    </div>
  );
}
