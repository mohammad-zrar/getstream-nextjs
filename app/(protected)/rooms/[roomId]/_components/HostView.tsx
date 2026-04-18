"use client";

import { useCallback, useState } from "react";
import {
  CallingState,
  LivestreamLayout,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";

export default function HostView() {
  const call = useCall();
  const { useCallCallingState, useIsCallLive } = useCallStateHooks();
  const callingState = useCallCallingState();
  const isLive = useIsCallLive();
  const [joining, setJoining] = useState(false);

  const handleJoin = useCallback(async () => {
    if (!call) return;
    setJoining(true);
    try {
      await call.join();
      await call.camera.enable();
      await call.microphone.enable();
    } finally {
      setJoining(false);
    }
  }, [call]);

  const handleGoLive = useCallback(async () => {
    await call?.goLive();
  }, [call]);

  const handleStopLive = useCallback(async () => {
    await call?.stopLive();
  }, [call]);

  const handleLeave = useCallback(async () => {
    await call?.leave();
  }, [call]);

  if (
    callingState === CallingState.IDLE ||
    callingState === CallingState.UNKNOWN
  ) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Ready to host?</h2>
        <p className="text-sm text-muted-foreground">
          Enter backstage to set up your camera and mic before going live.
        </p>
        <Button onClick={handleJoin} disabled={joining}>
          {joining ? "Entering..." : "Enter Backstage"}
        </Button>
      </div>
    );
  }

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Setting up your stream...
      </div>
    );
  }

  if (callingState === CallingState.LEFT) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Stream ended</h2>
        <Button onClick={handleJoin}>Restart</Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <LivestreamLayout />
      </div>
      <div className="flex items-center justify-center gap-3 p-4 border-t bg-background">
        <ToggleVideoPublishingButton />
        <ToggleAudioPublishingButton />
        {isLive ? (
          <Button variant="destructive" onClick={handleStopLive}>
            Stop Live
          </Button>
        ) : (
          <Button onClick={handleGoLive}>Go Live</Button>
        )}
        <Button variant="outline" onClick={handleLeave}>
          Leave
        </Button>
      </div>
    </div>
  );
}
