import { useEffect, useState } from "react";
import { appId, useClient, useMicrophoneAndCameraTracks } from "./Agora";
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-sdk-ng";
import { useAppSelector } from "../Redux/store";
import { userTypeInRoom } from "../Redux/types";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useWebRTCHookReturnType } from "./useWebRTC.types";
export function useWebRTC(roomName: string | undefined, 
    userInfo: {
        name: string | null;
        email: string | null;
        pic: string | null;
        userId: string | null;
        createdAt: string | null;
    }, socket:Socket): useWebRTCHookReturnType {
    const [userStream, setUsersStreams] = useState<IAgoraRTCRemoteUser[]>([])
    const [isReady, setIsReady] = useState<boolean>(false)
    const client = useClient()
    const { ready, tracks } = useMicrophoneAndCameraTracks()
    const [userInRoom, setUsersInRoom] = useState<userTypeInRoom[]>([])
    const rooms = useAppSelector(state => state.room.rooms)
    const [newUserStream,setNewUSerStream]= useState<IAgoraRTCRemoteUser>({} as IAgoraRTCRemoteUser)
    const navigate= useNavigate()
    const handleUserLeft = (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
        if (mediaType === "audio") {
            user.audioTrack?.stop()
        }
        if (mediaType === "video") {
            setUsersStreams(pre => pre.filter(item => item.uid !== user.uid))
        }
    }
    const handleUserUnPublished = (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
        if (mediaType === "audio") {
            user.audioTrack?.stop()
        }
        if (mediaType === "video") {
            // const isPublished = user.videoTrack
            setUsersStreams(pre => pre.filter(item => item.uid !== user.uid))
        }
    }
    useEffect(() => {
        const init = async (Cname: string) => {
            client.on("user-published", async (user, mediaType) => {
                console.log("users information", user)
                await client.subscribe(user, mediaType)
                // setNewUSerStream(user)
                if (mediaType === "video") {
                    setUsersStreams(pre => [...pre, user])
                }
                if (mediaType === "audio") {
                    user.hasAudio && user.audioTrack?.play()
                }
            })
            client.on("user-unpublished", handleUserUnPublished)
            client.on("user-left", handleUserLeft)
            try {
                // JSON.stringify({ name: userInfo.name, pic: userInfo.pic, userId: userInfo.userId }
                await client.join(appId, Cname, null, null)
            } catch (err) {
                console.log(err)
            }
            if (tracks) {
                await client.publish([tracks[0], tracks[1]])
            }
        }
        if (tracks && ready) {
            try {
                // roomName && init(roomName)
                setIsReady(true)
            } catch (err) {
                console.log(err)
            }
        }

        return () => {
            // tracks && client.unpublish(tracks).then(() => {
            //     client.leave()
            // })
            // client.off("user-left", handleUserLeft)
            // client.off("user-unpublished", handleUserUnPublished)
        }
    }, [roomName, tracks, ready, client])

    useEffect(() => {
        if (roomName) {
            const roomIndex = rooms.findIndex((item) => item.roomFullName === roomName)
            if (roomIndex === -1) {
                navigate("/")
            }
            else {
                setUsersInRoom(rooms[roomIndex].usersInRoom)
            }
        }
        return () => {
            if (userInfo.userId !== null) {
                socket.emit("on_room_leave", { ...userInfo, sid: socket.id, roomName: roomName })
            }
            //leave rooms
            const leave = async () => {
                await client.leave()
                client.removeAllListeners()
                client.removeAllListeners()
                if (tracks) {
                    tracks[0].close()
                    tracks[1].close()
                }
            }
            leave()
        }
    }, [socket,client])

    useEffect(() => {
        const roomIndex = rooms.findIndex((item) => item.roomFullName === roomName)
        if (roomIndex !== -1) {
            setUsersInRoom(rooms[roomIndex].usersInRoom)
        }
    }, [rooms])
    useEffect(() => {
        if (tracks) {
            // tracks[1].setEnabled(false)
            // tracks[0].setEnabled(false)
        }
    }, [tracks])
    return { userStream, client, roomName, isReady, ready, tracks, setUsersStreams }
}
