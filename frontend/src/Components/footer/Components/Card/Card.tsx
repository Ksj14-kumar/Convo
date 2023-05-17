import React, { useEffect, useState } from 'react';
import img1 from "../../../../assets/Image/alexandru-zdrobau-BGz8vO3pK8k-unsplash.jpg";
import img2 from "../../../../assets/Image/andrey-zvyagintsev-cRe4DeHtmsw-unsplash.jpg";
import img3 from "../../../../assets/Image/askar-ulzhabayev-mOnHNBhyjgM-unsplash.jpg";
import img4 from "../../../../assets/Image/roksolana-zasiadko-LyeduBb2Auk-unsplash.jpg";
import img5 from "../../../../assets/Image/clay-elliot-D2I2B4v1oe8-unsplash.jpg";
import img6 from "../../../../assets/Image/dave-goudreau-MJ2zd_OfxSw-unsplash.jpg";
import img7 from "../../../../assets/Image/fabio-jock-xbrkcLR_WFU-unsplash.jpg";
import img8 from "../../../../assets/Image/jens-lindner-dP6g1YJWQcA-unsplash.jpg";
import img9 from "../../../../assets/Image/joanna-nix-walkup-h2pnXHMz8YM-unsplash.jpg";
import img10 from "../../../../assets/Image/joanna-nix-walkup-p7zGmc33s0U-unsplash.jpg";
import img11 from "../../../../assets/Image/joao-paulo-de-souza-oliveira-x-FNmzxyQ94-unsplash.jpg";
import img12 from "../../../../assets/Image/jorik-kleen-lNNHyRbmm0o-unsplash.jpg";
import img13 from "../../../../assets/Image/kevin-hellhake-7BbHyuAf1sg-unsplash.jpg";
import img14 from "../../../../assets/Image/kirill-balobanov-Ef3AOkt6hHg-unsplash.jpg";
import img15 from "../../../../assets/Image/max-titov-i7-XMx8Dzrw-unsplash.jpg";
import img16 from "../../../../assets/Image/nikita-shirokov-17G27MClk2I-unsplash.jpg";
import img17 from "../../../../assets/Image/nikita-shirokov-b5v2jridnnE-unsplash.jpg";
import { useNavigate } from "react-router-dom"
import { roomType, userTypeInRoom } from '../../../../Redux/types';
import { Socket } from 'socket.io-client';
import { useAppSelector } from '../../../../Redux/store';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
const ringColors = [
    "[#D21312]",
    "[#fff]",
    "[#5F264A]",
    "[#643A6B]",
    "[#957777]",
    "[#B0A4A4]",
    "[#F9D949]",
    "[#7C9070]",
    "[#FEE8B0]",
    "[#9CA777]",
    "[#FFDCB6]",
    "[#A6D0DD]",
    "[#ECC9EE]",
    "[#9384D1]",
    "[#FF6969]",
    "[#A6D0DD]",
    "[#FFD3B0]",
    "[#0A4D68]",
    "[#05BFDB]",
    "[#088395]",
    "[#F6BA6F]",
    "[#ADE4DB]",
    "[#FFEBEB]",
    "[#2A2F4F]",
    "[#F3E99F]",
    "[#98D8AA]",
    "[#3C486B]",
    "[#7149C6]",
    "[#4F200D]",
    "[#FFED00]",
    "[#16FF00]",
    "[#0F6292]",
    "[#9DF1DF]",
    "[#F5EA5A]",
    "[#A31ACB]",
    "[#39B5E0]",
    "[#E3F6FF]",
    "[#D21312]",
    "[#810CA8]",
    "[#03001C]",
    "[#1A120B]",
    "[#03C988]",
    "[#2D033B]",
    "[#810CA8]",
    "[#F2F7A1]",
    "[#453C67]",
]

type propType = {
    item: roomType,
    socket: Socket,
    setRTPInfo: React.Dispatch<React.SetStateAction<RtpCapabilities>>
}
function Card({ item, socket, setRTPInfo }: propType) {
    const userinfo = useAppSelector((state) => state.auth)
    const [joinStatus, setJoinStatus] = useState<boolean>(false)
    // img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img17
    // const users = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img17]
    const users = [...item.usersInRoom]
    const countUsers = users.length
    const navigate = useNavigate()
    useEffect(() => {
        socket.on("isRoomFull", (params: boolean) => {
            console.log({ params })
            setJoinStatus(params)
        })
    }, [socket])
    return (
        // 041267
        <div className="card w-[28rem] min-h-[18rem] bg-[#04116764] rounded-md pb-4 drop-shadow-md border-[1px] border-[#110ad4] shadow-md">
            <header className="header  w-full px-[1rem] flex py-1 justify-between">
                <div className="wrapper flex items-center overflow-hidden">
                    <div className="group_name py-1 truncate">
                        <p className="text-[1.34rem] tracking-wider break-all break-words font-inter text-[#fff] truncate">{item.roomFullName}</p>
                    </div>
                </div>
                <div className="gear_icons">
                </div>
            </header>
            <section className="users px-3 pl-5 py-3 w-full flex-1">
                <div className={`wraper_user_list flex flex-wrap w-full ${users.length > 6 ? "justify-center" : countUsers <= 3 ? "justify-center items-center" : ""}`}>
                    {users.length > 0 && users.map((item: userTypeInRoom, index) => {
                        const colorCode = Math.floor(Math.random() * (ringColors.length))
                        return <div key={index} className="rounded-full">
                            <div className={` rounded-full ${countUsers <= 3 ? "w-[6rem] h-[6rem]" : "w-[4rem] h-[4rem]"}`}>
                                <img src={item.pic} className={`ring-2 object-cover w-full h-full ring-${ringColors[colorCode]} ring-offset-${ringColors[colorCode]} ring-offset-[3px] rounded-full`} />
                            </div>
                        </div>
                    })}
                </div>
            </section>
            <footer className="text-[1.4rem] font-inter flex justify-center py-3">
                <button
                    // disabled={joinStatus}
                    className="btn  text-lg w-[16rem] outline-dashed outline-[2.5px] outline-offset-[4px] outline-[#f0d229] bg-gradient-to-r from-[#0ab4cea9] via-[#07cceb] to-[#0d93a8] animate-pulse"
                    onClick={() => {
                        socket.emit("on_join", { ...userinfo, roomName: item.roomFullName }, (status: { status: number, message: string | RtpCapabilities }) => {
                            console.log({ status })
                            if (status.status === 400 || status.status === 404) {
                            }
                            else if (status.status === 200 && typeof status.message !== "string") {
                                navigate(`/room/${item.roomFullName}`)
                                setRTPInfo(status.message)
                            }
                            else if (status.status === 403) {
                                alert("you can not join room, room is fulll")
                            }
                        })
                    }}
                >Join</button>
            </footer>
        </div>
    )
}

export default Card