"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { joinRoomAction } from "@/actions/getstream";

interface JoinOrCreateRoomProps {
  joinAction: typeof joinRoomAction;
}

export default function JoinOrCreateRoom({
  joinAction,
}: JoinOrCreateRoomProps) {
  const [, action, pending] = useActionState(joinAction, undefined);

  return (
    <section className="flex justify-center gap-4 h-full">
      <Button>Create a Room</Button>
      <form action={action} className="flex">
        <Input
          id="roomId"
          name="roomId"
          placeholder="Enter Room ID"
          className="rounded-br-none rounded-tr-none"
        />
        <Button disabled={pending} className="rounded-tl-none rounded-bl-none">
          Join Room
        </Button>
      </form>
    </section>
  );
}
