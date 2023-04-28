import React from 'react'
import { MdMessage } from "react-icons/md"
function RoomComponents() {
    return (
        
        <header className="top_header flex gap-x-2 px-3 border-b pb-1">
            <div className="icons py-3 border-b px-3 border-b-[#fff] cursor-pointer">
                <MdMessage className='text-[1.8rem] text-[#fff] font-inter' />
            </div>
        </header>
    )
}

export default RoomComponents