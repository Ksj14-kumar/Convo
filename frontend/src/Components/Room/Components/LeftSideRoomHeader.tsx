import React, { useEffect, useState } from 'react'
import { IoIosVideocam } from "react-icons/io"
import { IoVideocamOff } from "react-icons/io5"
import { BsFillMicFill, BsMicMuteFill } from "react-icons/bs"
import { MdCall } from "react-icons/md"
type propType = {
    onRoomLeave: () => void,
    onControllerHandler: (id:number)=>void,
    controller: {
        audio: boolean;
        video: boolean;
    }
}
function LeftSideRoomHeader({ onRoomLeave, controller, onControllerHandler }: propType) {
    
    return (
        <header className="leftRoomSide py-[2rem] flex justify-center items-center">
            <div className="gr gap-x-1 bg-[#f5f3f3e2] px-4 py-[8px] rounded-md drop-shadow-md">
                <button className='btn btn-primary mr-1'
                    onClick={() => {
                        onControllerHandler(0)
                    }}
                >
                    {controller.audio ?
                        <BsFillMicFill className='text-[1.6rem]' /> :
                        <BsMicMuteFill className='text-[1.6rem]' />
                    }
                </button>
                <button className='btn btn-primary mr-1'
                    onClick={() => {
                        onControllerHandler(1)
                    }}
                >
                    {controller.video ?
                        <IoIosVideocam className='text-[1.6rem]' /> :
                        <IoVideocamOff className='text-[1.6rem]' />
                    }
                </button>
                <button className='btn  mr-1 bg-[#045b78]'
                    onClick={() => {
                        onRoomLeave()
                    }}
                >
                    <MdCall className='text-[1.6rem] text-[#f10606]' />
                </button>
            </div>
        </header>
    )
}

export default LeftSideRoomHeader