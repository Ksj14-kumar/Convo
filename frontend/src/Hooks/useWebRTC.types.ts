import { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import { Socket } from "socket.io-client";

export type useWebRTCHookReturnType={
    userStream: IAgoraRTCRemoteUser[],
    client: IAgoraRTCClient,
    roomName: string | undefined,
    isReady: boolean,
    ready: boolean,
    tracks: [IMicrophoneAudioTrack, ICameraVideoTrack] | null,
    setUsersStreams: React.Dispatch<React.SetStateAction<IAgoraRTCRemoteUser[]>>
}
