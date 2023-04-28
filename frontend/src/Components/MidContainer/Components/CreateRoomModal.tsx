import React, { useEffect, useReducer, useRef } from 'react'
import { IoClose } from "react-icons/io5"
import { initialState } from '../types/CreateModalReducerHandler'
import { reducerHandler } from '../ReducerHandler/CreateModalHanlder'
import { Socket } from 'socket.io-client'
import { auth, useAppSelector } from '../../../Redux/store'
import { nanoid } from 'nanoid'
type propType = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    socket: Socket
}
function CreateRoomModal({ setShowModal, socket }: propType) {
    const [newRoomCreate, dispatch] = useReducer(reducerHandler, initialState)
    const userInfo = useAppSelector(auth)
    const inputRef = useRef<HTMLInputElement>(null)
    const isEnabledButton = Boolean(newRoomCreate.roomName) && Boolean(newRoomCreate.count)
    function onNewRoomInfoSubmit() {
        if (isEnabledButton) {
            //TODO:createRoom
            userInfo.userId && userInfo.email && socket.emit("new_room_create", { roomId: nanoid(), roomName: newRoomCreate.roomName, count: newRoomCreate.count, userId: userInfo.userId, email: userInfo.email }, (result: number) => {
                if (result) {
                    dispatch({ type: "room", payload: { value: "" } })
                    inputRef.current?.focus()
                }
            })
        }
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [inputRef])
    return (
        <div className='bg-[#d3cbcb00] fixed top-0 w-screen z-[4] h-screen'>
            <div className="modal_ flex justify-center items-start py-[2rem]">
                <div className="modal_wrap bg-[#24289098] w-[40rem] rounded-md drop-shadow-md">
                    <header className="top_header flex justify-end">
                        <button
                            className='bg-[#eb0404] rounded-tr-md p-2 px-3 rounded-bl-md'
                            onClick={() => {
                                setShowModal(false)
                            }}
                        >
                            <IoClose className='text-[1.6rem] text-[#fff]' />
                        </button>
                    </header>
                    <main className="input_field py-4 flex flex-col gap-y-[2rem]">
                        <div className="name_room px-4 w-full">
                            <input
                                ref={inputRef}
                                type="text"
                                className='w-full py-3 rounded-md indent-4 font-inter tracking-wider text-[1.2rem]'
                                placeholder='name'
                                value={newRoomCreate.roomName}
                                onChange={(e) => {
                                    dispatch({ type: "room", payload: { value: e.target.value } })
                                }}
                            />
                        </div>
                        <div className="clients px-4 w-full">
                            {/* <input type="text" className='w-full py-3 rounded-md indent-4 font-inter tracking-wider' placeholder='' /> */}
                            <select
                                name=""
                                className='w-full py-3 rounded-md px-4 text-[1.2rem]'
                                id=""
                                onChange={(e) => {
                                    dispatch({ type: "count", payload: { value: e.target.value } })
                                }}
                            >
                                <option value="unlimited">Unlimited</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                            </select>
                        </div>
                        <footer className='flex justify-center items-center'>
                            <div className="group-of_button flex justify-center items-center w-full">
                                <div className="buttons pr-[3rem]">
                                    <button className='btn btn-warning'
                                        onClick={() => {
                                            dispatch({ type: "room", payload: { value: "" } })
                                            dispatch({ type: "count", payload: { value: "" } })
                                            setShowModal(false)
                                        }}
                                    >Cancel</button>
                                </div>
                                <div className="buttons">
                                    <button
                                        disabled={!isEnabledButton}
                                        onClick={onNewRoomInfoSubmit}
                                        className={`btn btn-success`}>Create</button>
                                </div>
                            </div>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default CreateRoomModal