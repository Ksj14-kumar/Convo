import React, { useEffect } from 'react'
import Home from './Home'
import { Router, Route, BrowserRouter, Routes, Navigate } from "react-router-dom"
import Room from './Room'
import { Socket } from 'socket.io-client/build/esm/socket'
import Login from './Login'
import { useGetUserMutation } from '../Redux/apiHandler'
import { userInfoAftreLogin } from '../Redux/types'
import { useAppDispatch, useAppSelector } from '../Redux/store'
import { setInfo } from '../Redux/ReducerHandler'
function MainContainer({ socket }: { socket: Socket }) {
    const [callback, error] = useGetUserMutation()
    const dispatch = useAppDispatch()
    const auth = useAppSelector(state => state.auth)
    const isUserAuth = auth.email && auth.createdAt && auth.name && auth.pic && auth.userId
    useEffect(() => {
        (async function () {
            try {
                const res: userInfoAftreLogin = await callback("").unwrap()
                if (res) {
                    dispatch(setInfo({ name: res.name, email: res.email, pic: res.pic, id: res.id, createdAt: res.createdAt }))
                }
            } catch (err) {
                console.log(err)
            }
        })()
    }, [])
    return (
        <BrowserRouter>
            {/* #061DA2 */}
            <div className='flex flex-col h-screen w-full bg-[#040148]'>
                <Routes>
                    {
                        isUserAuth ?
                            <>
                                <Route element={<Home socket={socket} />} path='/' />
                                <Route element={<Room socket={socket} />} path='/room/:roomId' />
                                <Route element={<Navigate to="/" replace />} path='*' />
                            </> :
                            <>
                                <Route element={<Login />} path='/login' />
                                <Route element={<Navigate to="/login" replace />} path='*' />
                            </>
                    }

                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default MainContainer