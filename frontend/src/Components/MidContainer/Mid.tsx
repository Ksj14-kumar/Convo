import { Socket } from 'socket.io-client'
import CreateRoomModal from './Components/CreateRoomModal'
import React from 'react'
import { useState } from 'react'
type propType = {
    socket: Socket,
    onInputChange:string,
    setOnInputchange:React.Dispatch<React.SetStateAction<string>>
}
function Mid({ socket,onInputChange,setOnInputchange }: propType) {
    const [showModal, setShowModal] = useState<boolean>(false)
    
    return (
        <div className="wrapr">
            {showModal && <CreateRoomModal socket={socket} setShowModal={setShowModal} />}
            <section className="search_section py-[10px]">
                <div className="search_bar md:px-[15rem] px-[2rem] pb-2">
                    <input type="search" placeholder='Search room...' className='text-lg w-full py-2 rounded-md px-2 indent-2 outline-none'
                        onChange={(e) => {
                            setOnInputchange(e.target.value)
                        }}
                        value={onInputChange}
                    />
                </div>
                <div className="create_room md:px-[15rem] px-[2rem]">
                    <button className='text-lg btn btn-block bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500'
                        onClick={() => {
                            setShowModal(!showModal)
                        }}
                    >Create Room</button>
                </div>
            </section>
        </div>
    )
}
export default React.memo(Mid)