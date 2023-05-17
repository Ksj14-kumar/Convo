import { useAppSelector } from "../../Redux/store"
import { roomType } from "../../Redux/types"
import React from 'react'
import Card from "./Components/Card/Card"
import { Socket } from "socket.io-client"
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters"
function Footer({ roomsFilterBySearch,socket,setRTPInfo }: { roomsFilterBySearch: roomType[],socket:Socket,setRTPInfo:React.Dispatch<React.SetStateAction<RtpCapabilities>> }) {
    return (
        <main className="group_sections flex-1 overflow-y-auto" id="card-scrollbar">
            <div className={`wrapper_card flex flex-wrap md:px-[7rem] px-[2rem] py-2 gap-x-3 gap-y-2 ${roomsFilterBySearch.length > 3 ? "justify-center" : "justify-start"}`}>
                {
                    roomsFilterBySearch.map((item: roomType, index: number) => {
                        return <Card socket={socket} key={index} item={item} setRTPInfo={setRTPInfo}/>
                    })
                }
            </div>
        </main>
    )
}
export default React.memo(Footer)