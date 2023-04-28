import React, { useCallback, useState, useEffect } from 'react'
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
function Room({ socket }: { socket: Socket }) {
    const [inputMessage, setInputMessage] = useState<string>("")
    const [allMessage, setAllMessage] = useState<string[]>([])
    const userInfo = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()
    const { roomId } = useParams()
    const [userInRoom, setUsersInRoom] = useState<userTypeInRoom[]>([])
    const rooms = useAppSelector(state => state.room.rooms)
    const { userStream, client, roomName, isReady, tracks, ready, setUsersStreams } = useWebRTC(roomId,userInfo,socket)
    const navigate = useNavigate()
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
    // useEffect(() => {
    //     if (roomId) {
    //         const roomIndex = rooms.findIndex((item) => item.roomFullName === roomId)
    //         if (roomIndex === -1) {
    //             navigate("/")
    //         }
    //         else {
    //             setUsersInRoom(rooms[roomIndex].usersInRoom)
    //         }
    //     }
    //     return () => {
    //         if (userInfo.userId !== null) {
    //             socket.emit("on_room_leave", { ...userInfo, sid: socket.id, roomName: roomId })
    //         }
    //         //leave rooms
    //         const leave = async () => {
    //             await client.leave()
    //             client.removeAllListeners()
    //             client.removeAllListeners()
    //             if (tracks) {
    //                 tracks[0].close()
    //                 tracks[1].close()
    //             }
    //         }
    //         leave()
    //     }
    // }, [client])


    
    useEffect(() => {
        if (roomId) {
            const roomIndex = rooms.findIndex((item) => item.roomFullName === roomId)
            if (roomIndex === -1) {
                navigate("/")
            }
            else {
                setUsersInRoom(rooms[roomIndex].usersInRoom)
            }
        }
        return () => {
            if (userInfo.userId !== null) {
                socket.emit("on_room_leave", { ...userInfo, sid: socket.id, roomName: roomId })
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
        const roomIndex = rooms.findIndex((item) => item.roomFullName === roomId)
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
   
    const onRoomLeave = async () => {
        socket.emit("on_room_leave", { ...userInfo, sid: socket.id, roomName: roomId })
        navigate("/")
        await client.leave()
        client.removeAllListeners()
        if (tracks) {
            tracks[0].close()
            tracks[1].close()
        }
    }
    return (
        <div className='room flex h-full'>
            {
                (tracks && ready) &&
                <>
                    <LeftSideOfRoom ownTracks={tracks} userInRoom={userInRoom} onRoomLeave={onRoomLeave} userStreams={userStream} />
                    <div className="right_side  flex flex-col flex-[3] border-l border-[#041c7c] flex-shrink-0 shrink-0 mobile:hidden">
                        <RoomComponents />
                        <MessageReaderBox allMessage={allMessage} />
                        <InputMessageBox onEmojiSelect={onEmojiSelect} setInputMessage={setInputMessage} inputMessage={inputMessage} onMessageSubmit={onMessageSubmit} />
                    </div>
                </>
            }
        </div >
    )
}

export default Room
