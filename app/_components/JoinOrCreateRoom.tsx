"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { joinRoomAction } from "@/actions/getstream";

interface JoinOrCreateRoomProps {
  joinAction: typeof joinRoomAction;
}

export default function JoinOrCreateRoom({ joinAction }: JoinOrCreateRoomProps) {
  const [, action, pending] = useActionState(joinAction, undefined);

  return (
    <div>
      <form action={action} className="space-y-4">
        <Input id="roomId" name="roomId" placeholder="Enter Room ID" />
        <Button disabled={pending}>Join Room</Button>
      </form>
      <Button>Create a Room</Button>
    </div>
  );
}
