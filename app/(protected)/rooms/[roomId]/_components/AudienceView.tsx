"use client";

import { useRouter } from "next/navigation";
import { LivestreamPlayer } from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";

export default function AudienceView({
  callType,
  callId,
}: {
  callType: string;
  callId: string;
}) {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <LivestreamPlayer
          callType={callType}
          callId={callId}
          joinBehavior="live"
        />
      </div>
      <div className="flex justify-end p-4 border-t bg-background">
        <Button variant="outline" onClick={() => router.push("/")}>
          Leave Stream
        </Button>
      </div>
    </div>
  );
}
