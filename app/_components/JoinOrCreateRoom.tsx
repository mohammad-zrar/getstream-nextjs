"use client";

import type { createRoomAction, joinRoomAction } from "@/actions/getstream";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

interface JoinOrCreateRoomProps {
  joinAction: typeof joinRoomAction;
  createAction: typeof createRoomAction;
}

export default function JoinOrCreateRoom({
  joinAction,
  createAction,
}: JoinOrCreateRoomProps) {
  const [, joinFormAction, joinPending] = useActionState(joinAction, undefined);
  const [createState, createFormAction, createPending] = useActionState(
    createAction,
    undefined,
  );
  const [joinRoomId, setJoinRoomId] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const createdRoomId = createState?.roomId;
  const roomUrl = createdRoomId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/rooms/${createdRoomId}`
    : "";

  return (
    <section className="flex justify-center gap-4 h-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <form action={createFormAction}>
            <Button type="submit" disabled={createPending}>
              {createPending ? "Creating..." : "Create a Room"}
            </Button>
          </form>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Room</DialogTitle>
          </DialogHeader>

          {createPending ? (
            <div className="flex justify-center h-32 items-center">
              <Spinner className="size-8" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <DialogDescription className="sr-only">
                Room created. Copy the ID or URL below.
              </DialogDescription>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Room ID</p>
                <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
                  <code className="flex-1 text-sm break-all">
                    {createdRoomId}
                  </code>
                  <CopyButton text={createdRoomId!} />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Room URL</p>
                <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
                  <code className="flex-1 text-sm break-all">{roomUrl}</code>
                  <CopyButton text={roomUrl} />
                </div>
              </div>
            </div>
          )}
          {!createPending && (
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={() => router.push(`/rooms/${createdRoomId}`)}>
                Join Room
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <form action={joinFormAction} className="flex">
        <Input
          id="roomId"
          name="roomId"
          placeholder="Enter Room ID"
          className="rounded-br-none rounded-tr-none"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
        />
        <Button
          disabled={joinPending || joinRoomId.trim() === ""}
          className="rounded-tl-none rounded-bl-none"
        >
          Join Room
        </Button>
      </form>
    </section>
  );
}
