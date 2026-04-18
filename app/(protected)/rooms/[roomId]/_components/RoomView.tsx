"use client";

import { useEffect, useState } from "react";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  type Call,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import HostView from "./HostView";
import AudienceView from "./AudienceView";

interface RoomViewProps {
  callId: string;
  callType: string;
  isHost: boolean;
  userId: string;
  userName: string;
  token: string;
  apiKey: string;
}

export default function RoomView({
  callId,
  callType,
  isHost,
  userId,
  userName,
  token,
  apiKey,
}: RoomViewProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    const videoClient = new StreamVideoClient({
      apiKey,
      user: { id: userId, name: userName },
      token,
    });
    const videoCall = videoClient.call(callType, callId);

    setClient(videoClient);
    setCall(videoCall);

    return () => {
      videoCall.leave().catch(console.error);
      videoClient.disconnectUser().catch(console.error);
    };
  }, []);

  if (!client || !call) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Connecting...
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      {isHost ? (
        <StreamCall call={call}>
          <HostView />
        </StreamCall>
      ) : (
        <AudienceView callType={callType} callId={callId} />
      )}
    </StreamVideo>
  );
}
