import React, { useCallback, useState, useEffect, useRef } from 'react'
import RoomComponents from '../Components/Room/RoomComponents'
import MessageReaderBox from '../Components/Room/Components/MessageReaderBox'
import InputMessageBox from '../Components/Room/Components/InputMessageBox';
import LeftSideOfRoom from '../Components/Room/LeftSideOfRoom';
import { EmojiClickData } from "emoji-picker-react"
import { Socket } from 'socket.io-client/build/esm/socket'
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../Redux/store';
import { userTypeInRoom } from '../Redux/types';
import { removeCurrentUserFromRoom } from '../Redux/ReducerHandler';
import { useWebRTC } from '../Hooks/useWebRTC';
import { AgoraVideoPlayer, IAgoraRTCRemoteUser } from 'agora-rtc-react';
import useMediaSoupWEBRTC from '../Hooks/useMediaSoupWEBRTC';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { AppData } from 'mediasoup-client/lib/types';
import { VideoParams } from '../Config/mediaSoup.config';
function Room({ socket, rtpInfo }: { socket: Socket, rtpInfo: RtpCapabilities }) {
    const [inputMessage, setInputMessage] = useState<string>("")
    const [allMessage, setAllMessage] = useState<string[]>([])
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const [mediaControls, setMediaControls] = useState<{ audio: boolean, video: boolean }>({ audio: true, video: true })
    const userInfo = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()
    const rooms = useAppSelector(state => state.room.rooms)
    const { roomId } = useParams()
    const [userInRoom, setUsersInRoom] = useState<userTypeInRoom[]>([])
    const navigate = useNavigate()
    const [videoParams, setVideoParams] = useState<AppData>(VideoParams)
    const [audioParams, setAudioParams] = useState({})


    const onEmojiSelect = (e: EmojiClickData) => {
        const emoji = e.emoji
        setInputMessage(pre => pre + emoji)
    }
    const onMessageSubmit = useCallback(() => {
        if (inputMessage) {
            setAllMessage(pre => [...pre, inputMessage])
            setInputMessage("")
        }
    }, [inputMessage])

    if (!roomId) {
        navigate("/")
    }
    useEffect(() => {
        const roomIndex = rooms.findIndex((item) => item.roomFullName === roomId)
        if (roomIndex !== -1) {
            setUsersInRoom(rooms[roomIndex].usersInRoom)
        }
    }, [rooms])
    useEffect(() => {
        async function getUserMedia() {
            try {
                const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                {
                    const videoTrack = stream.getVideoTracks()[0]
                    setLocalStream(stream)
                    const audioTrack = stream.getAudioTracks()[0]
                    setVideoParams(pre => {
                        return {
                            ...pre,
                            track: videoTrack
                        }
                    })
                    setAudioParams(pre => {
                        return {
                            ...pre,
                            track: audioTrack
                        }
                    })
                }
            } catch (err) {
                console.log("err")
            }
        }
        getUserMedia()
    }, [])


    const { allTracks, userProfileInfo } = useMediaSoupWEBRTC(rtpInfo, socket, localStream, videoParams, audioParams)
    const isStreamDisabled = (id: number) => {
        if (id === 1) {
            setMediaControls((prevControls) => ({
                ...prevControls,
                video: !prevControls.video,
            }));
            console.log("stream options is start", localStream)
            localStream?.getVideoTracks()[0].enabled == !mediaControls.video;
           
            console.log("stream options is end", localStream)
        } else if (id === 2) {
            setMediaControls((prevControls) => ({
                ...prevControls,
                audio: !prevControls.audio,
            }));
            // localStream?.getAudioTracks()[0].enabled = !mediaControls.audio;
        }
    }

    const onRoomLeave = async () => {
        socket.emit("on_room_leave", { ...userInfo, sid: socket.id, roomName: roomId })
        navigate("/")
        // await client.leave()
        // client.removeAllListeners()
        // if (tracks) {
        //     tracks[0].close()
        //     tracks[1].close()
        // }
    }
    console.log({ userProfileInfo, localStream })
    return (
        <div className='room flex h-full'>
            {localStream && <LeftSideOfRoom ownTracks={allTracks} onRoomLeave={onRoomLeave} localStream={localStream} isStreamDisabled={isStreamDisabled} mediaControls={mediaControls} />}
            <div className="right_side  flex flex-col flex-[3] border-l border-[#041c7c] flex-shrink-0 shrink-0 mobile:hidden">
                <RoomComponents />
                <MessageReaderBox allMessage={allMessage} />
                <InputMessageBox onEmojiSelect={onEmojiSelect} setInputMessage={setInputMessage} inputMessage={inputMessage} onMessageSubmit={onMessageSubmit} />
            </div>
        </div >
    )
}
export default Room
