"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CallingState,
  LivestreamLayout,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

function useDevicePreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraAvailable, setCameraAvailable] = useState(false);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        setCameraAvailable(true);
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setCameraAvailable(false));
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const toggleCamera = useCallback(() => {
    setCameraEnabled((prev) => {
      const next = !prev;
      streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = next; });
      return next;
    });
  }, []);

  const toggleMic = useCallback(() => setMicEnabled((prev) => !prev), []);

  const stopPreview = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  return { videoRef, cameraEnabled, micEnabled, cameraAvailable, toggleCamera, toggleMic, stopPreview };
}

export default function HostView() {
  const call = useCall();
  const { useCallCallingState, useIsCallLive, useCameraState, useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const isLive = useIsCallLive();
  const { isMute: isCameraMuted } = useCameraState();
  const { isMute: isMicMuted } = useMicrophoneState();
  const [joining, setJoining] = useState(false);
  const { videoRef, cameraEnabled, micEnabled, cameraAvailable, toggleCamera, toggleMic, stopPreview } =
    useDevicePreview();

  const handleJoin = useCallback(async () => {
    if (!call) return;
    setJoining(true);
    stopPreview();
    try {
      await call.join();
      if (cameraEnabled) await call.camera.enable();
      if (micEnabled) await call.microphone.enable();
    } finally {
      setJoining(false);
    }
  }, [call, cameraEnabled, micEnabled, stopPreview]);

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
      <div className="h-full flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Ready to host?</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Preview your camera and mic, then enter backstage.
          </p>
        </div>
        <div className="relative w-full max-w-md aspect-video bg-muted rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
            style={{ display: cameraAvailable && cameraEnabled ? "block" : "none" }}
          />
          {(!cameraAvailable || !cameraEnabled) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CameraOff className="size-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={cameraEnabled ? "outline" : "destructive"}
            size="icon"
            onClick={toggleCamera}
            title={cameraEnabled ? "Turn camera off" : "Turn camera on"}
          >
            {cameraEnabled ? <Camera className="size-4" /> : <CameraOff className="size-4" />}
          </Button>
          <Button
            variant={micEnabled ? "outline" : "destructive"}
            size="icon"
            onClick={toggleMic}
            title={micEnabled ? "Mute mic" : "Unmute mic"}
          >
            {micEnabled ? <Mic className="size-4" /> : <MicOff className="size-4" />}
          </Button>
          <Button onClick={handleJoin} disabled={joining}>
            {joining ? "Entering..." : "Enter Backstage"}
          </Button>
        </div>
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
