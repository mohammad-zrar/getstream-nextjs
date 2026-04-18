import { createRoomAction, joinRoomAction } from "@/actions/getstream";
import JoinOrCreateRoom from "./_components/JoinOrCreateRoom";

export default function HomePage() {
  return (
    <div className="h-full p-16 grid grid-rows-4">
      <div className="">
        <h1 className="text-3xl font-bold text-center">
          Welcome to the GetStream ReactJS Demo!
        </h1>
      </div>

      <div className="row-span-3">
        <JoinOrCreateRoom joinAction={joinRoomAction} createAction={createRoomAction} />
      </div>
    </div>
  );
}
