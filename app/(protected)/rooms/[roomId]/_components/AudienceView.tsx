"use client";

import { LivestreamPlayer } from "@stream-io/video-react-sdk";

export default function AudienceView({
  callType,
  callId,
}: {
  callType: string;
  callId: string;
}) {
  return (
    <div className="h-full">
      <LivestreamPlayer
        callType={callType}
        callId={callId}
        joinBehavior="live"
      />
    </div>
  );
}
