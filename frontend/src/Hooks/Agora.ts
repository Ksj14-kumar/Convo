import React, { useEffect, useState } from "react";
import {
    ClientConfig,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import {
    AgoraVideoPlayer,
    createClient,
    createMicrophoneAndCameraTracks,
} from "agora-rtc-react";

export const config: ClientConfig = {
    mode: "rtc",
    codec: "vp8",
};

export const appId: string = "ed33ee36e6274d05982826c813683b6c"
export const useClient = createClient(config)
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()
export const channelName: string = "main"