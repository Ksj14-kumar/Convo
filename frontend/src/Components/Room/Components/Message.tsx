import React, { useEffect, useRef } from 'react'
import img1 from "../../../assets/Image/andrey-zvyagintsev-cRe4DeHtmsw-unsplash.jpg"
type propType = {
    msg: string,
    messageBoxRef:React.RefObject<HTMLDivElement>
}
function Message({ msg,messageBoxRef }: propType) {
   
    return (
        <div ref={messageBoxRef} className="wrapper_message flex justify-between items-center py-1 text-[1.2rem]">
            <div className="messageBox px-2 py-2 flex">
                <div className="profile_image w-[3rem] h-[3rem] flex-shrink-0">
                    <img src={img1} className='w-full h-full rounded-full ring-[1px] ring-[#fff] ring-offset-1' alt="" />
                </div>
                <div className="info pl-2">
                    <div className="name">
                        <p className='text-[#1899e9] font-semibold truncate'>Julia</p>
                    </div>
                    <div className="message">
                        <p className='text-[#fff] break-words break-all flex-wrap text-sm'>{msg}</p>
                    </div>
                </div>
            </div>
            <div className="time px-4">
                <p className='text-[#fff] text-sm'>7:PM</p>
            </div>
        </div>
    )
}

export default Message