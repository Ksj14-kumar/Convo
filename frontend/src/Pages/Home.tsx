import React, { useEffect, useState, useMemo } from 'react'
import Header from '../Components/Header/Header'
import Mid from '../Components/MidContainer/Mid'
import Footer from '../Components/footer/Footer'
import { Socket } from 'socket.io-client/build/esm/socket'
import { useAppSelector } from '../Redux/store'
import { roomType } from '../Redux/types'
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters'
function Home({ socket,setRTPInfo }: { socket: Socket,setRTPInfo:React.Dispatch<React.SetStateAction<RtpCapabilities>> }) {
    const [onInputChange, setOnInputchange] = useState<string>("")
    const [roomsFilterBySearch, setRoomFilterBySearch] = useState<roomType[]>([])
    const roomsList = useAppSelector(state => state.room.rooms)
    const memoized = useMemo(() => {
        const result = roomsList.filter((item) => item.roomFullName.toLowerCase().includes(onInputChange.toLowerCase()))
        if (result.length > 0) {
            setRoomFilterBySearch(result)
        }
        else {
            setRoomFilterBySearch(roomsList)
        }
    }, [onInputChange, roomsList])
    useEffect(() => {
        memoized
    }, [])
    return (
        <>
            <Header />
            <Mid socket={socket} setOnInputchange={setOnInputchange} onInputChange={onInputChange} />
            <Footer roomsFilterBySearch={roomsFilterBySearch} socket={socket} setRTPInfo={setRTPInfo} />
        </>
    )
}

export default Home