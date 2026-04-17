import { joinRoomAction } from "@/actions/getstream";
import JoinOrCreateRoom from "./_components/JoinOrCreateRoom";

export default function HomePage() {
  return (
    <main>
      <h1 className="text-2xl font-bold">Welcome to the GetStream ReactJS Demo!</h1>
      <JoinOrCreateRoom joinAction={joinRoomAction} />
    </main>
  );
}
