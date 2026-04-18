"use client";

import { useCallback, useState } from "react";
import {
  CallingState,
  LivestreamLayout,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HostView() {
  const call = useCall();
  const { useCallCallingState, useIsCallLive, useCameraState, useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const isLive = useIsCallLive();
  const { isMute: isCameraMuted } = useCameraState();
  const { isMute: isMicMuted } = useMicrophoneState();
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
        <Button
          variant={isCameraMuted ? "destructive" : "outline"}
          size="icon"
          onClick={() => call?.camera.toggle()}
          title={isCameraMuted ? "Turn camera on" : "Turn camera off"}
        >
          {isCameraMuted ? <CameraOff className="size-4" /> : <Camera className="size-4" />}
        </Button>
        <Button
          variant={isMicMuted ? "destructive" : "outline"}
          size="icon"
          onClick={() => call?.microphone.toggle()}
          title={isMicMuted ? "Unmute mic" : "Mute mic"}
        >
          {isMicMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
        </Button>
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
