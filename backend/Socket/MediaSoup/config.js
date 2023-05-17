module.exports.MEDIASOUP_OPTIONS = {
    WORKER_OPTIONS: {
        logLevel: "error",
        logTags: "",
        rtcMinPort: 2000,
        rtcMaxPort: 2020,
        dtlsCertificateFile: "",
        dtlsPrivateKeyFile: ""
    },
    ROUTER_OPTIONS: [
        {
            kind: "audio",
            mimeType: "audio/opus",
            clockRate: 48000,
            channels: 2
        },
        {
            kind: "video",
            mimeType: 'video/VP8',
            clockRate: 90000,
            parameters: {
                'x-google-start-bitrate': 1000,
            }
        }
    ],
    WEBRTCTRANSPORT_OPTIONS: {
        // Use webRtcServer or listenIps
        listenIps: [{ ip: "0.0.0.0", announcedIp: "127.0.0.1" }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true
    }
}