import React, { useEffect, useRef, useState } from 'react'
import { config, useClient, useMicrophoneAndCameraTracks, channelName, appId } from '../Hooks/Agora'
import AgoraRTC, { IAgoraRTCRemoteUser, IMicrophoneAudioTrack, ICameraVideoTrack, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import { AgoraVideoPlayer } from 'agora-rtc-react';
function VideoCall() {
    const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([])
    const [start, setStart] = useState(false)
    const client = useClient()
    const { ready, tracks, error } = useMicrophoneAndCameraTracks() //track audio and video
    useEffect(() => {
        const init = async (name: string) => {
            //TODO: user published stream
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType) //TODO: subsribe user after stream published
                if (mediaType === "video") {
                    setUsers(pre => {
                        return [...pre, user]
                    })
                }
                if (mediaType === "audio") {
                    user.hasAudio && user.audioTrack?.play()
                }
            })
            // TODO:user stop published stream
            client.on("user-unpublished", async (user, mediatype) => {
                if (mediatype === "audio" && !user.hasAudio) {
                    user.audioTrack?.stop()
                }
                if (mediatype === "video") {
                    setUsers(pre => {
                        return pre.filter(preUser => preUser.uid !== user.uid)
                    })
                }
            })
            // TODO:user left stream
            client.on("user-left", async (user) => {
                setUsers(pre => {
                    return pre.filter(preUser => preUser.uid !== user.uid)
                })
            })

            // TODO: join user after stream published
            try {
                (await AgoraRTC.createCameraVideoTrack()).setEnabled(false)
                    ; (await AgoraRTC.createMicrophoneAudioTrack()).setEnabled(false)
                await client.join(appId, name, null, null) //last represnt uuid
            } catch (err) {
                console.log("error occured", err)
            }

            // TODO: publish stream of user
            if (tracks) {
                await client.publish([tracks[0], tracks[1]])
            }
        }
        if (tracks && ready) {
            try {
                init(channelName)
                setStart(true)
            } catch (err) {
                console.log(err)
            }
        }
    }, [channelName, client, ready, tracks])


    console.log(users)
    return (
        <div>
            {(tracks && ready) &&
                <Control tracks={tracks} setStart={setStart} />
            }
            {
                (start && tracks) && <Videos tracks={tracks} users={users} />
            }
        </div>
    )
}
export default VideoCall

type propType = {
    setStart: React.Dispatch<React.SetStateAction<boolean>>,
    tracks: [IMicrophoneAudioTrack, ICameraVideoTrack] | null
}
function Control({ tracks, setStart }: propType) {
    const client = useClient()
    const [controls, setControls] = useState<{ audio: boolean, video: boolean }>({ audio: true, video: true })

    const muteMic = (type: string) => {
        if (type === "audio" && tracks) {
            tracks[0].setEnabled(!controls.audio)
            setControls(pre => {
                return {
                    ...pre,
                    audio: !controls.audio
                }
            })
        }
        if (type === "video" && tracks) {
            tracks[1].setEnabled(!controls.video)
            setControls(pre => {
                return {
                    ...pre,
                    video: !controls.video
                }
            })
        }
    }
    const onLeave = async () => {
        await client.leave()
        client.removeAllListeners()
        if (tracks) {
            tracks[0].close()
            tracks[1].close()
        }
        setStart(false)

    }
    return (
        <>
            <button className='bg-blue-600 px-4 py-2 rounded-md' onClick={() => {
                muteMic("audio")
            }}>
                {!controls.audio ? "onMic" : "offMic"}
            </button>
            <button
                onClick={() => {
                    muteMic("video")
                }}
                className='bg-green-600 px-4 py-2 rounded-md'>
                {!controls.video ? "onVideo" : "offVideo"}
            </button>
            <button className=' bg-[#fff] px-4 py-2 rounded-md' onClick={onLeave}>leave</button>
        </>
    )
}



type propTypes = {
    tracks: [IMicrophoneAudioTrack, ICameraVideoTrack] | null,
    users: IAgoraRTCRemoteUser[]

}
function Videos({ tracks, users }: propTypes) {
    console.log({ tracks })
    return (
        <>
            {tracks && <AgoraVideoPlayer videoTrack={tracks[1]} className='w-[20rem] h-[12rem]' />}
            <div className="wrapper w-full flex justify-start flex-wrap">

                {
                    users.length > 0 && users.map((user: IAgoraRTCRemoteUser) => {
                        console.log({ user })
                        // <AgoraVideoPlayer videoTrack={user.videoTrack} key={user.uid} />
                        if (user.videoTrack) {
                            return <AgoraVideoPlayer config={{ mirror: true, fit: "cover" }} videoTrack={user.videoTrack} key={user.uid} className='w-[20rem] h-[12rem]' />
                        }
                        else {
                            return null
                        }
                    })
                }
            </div>
        </>
    )
}





function VideosUser({ track }: { track: any }) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = track
        }
    }, [videoRef])
    return (
        <div className="videos">
            <video src="" ref={videoRef}></video>
        </div>
    )
}