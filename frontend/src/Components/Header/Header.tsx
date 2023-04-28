import React, { useState,useEffect,useRef } from 'react'
import DropDown from './Components/DropDown'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../Redux/store'
function Header() {
    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const userInfo = useAppSelector(state => state.auth)
    const navigate = useNavigate()
    const dropDownRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        function handleClick(e: any) {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
                setShowDropDown(false)
            }
        }
        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [dropDownRef])
    return (
        <header className="top-header py-2 flex pl-[4rem] pr-[1rem] md:pr-[2rem] align-middle items-center">
            <div className="logo font-medium text-lg font-sans tracking-wider text-[#fff] flex-[6] cursor-pointer" onClick={() => {
                navigate("/")
            }}>FreeTalk</div>
            <div ref={dropDownRef} className="profile_dropdown relative justify-end flex flex-[6] ">
                <div
                    className="image_section w-[3rem] h-[3rem] cursor-pointer"
                    onClick={() => {
                        setShowDropDown(!showDropDown)
                    }}
                >
                    {userInfo.pic ?
                        <img src={userInfo.pic} className=' rounded-full w-full h-full  ring-2 ring-offset-1 ring-[#fbfbfb]' alt="" /> :
                        <img src={""} className=' rounded-full w-full h-full flex-shrink-0 shrink-0 ring-2 ring-offset-1 ring-[#fbfbfb]' alt="" />
                    }
                </div>
                {showDropDown && <DropDown userInfo={userInfo} />}
            </div>
        </header>
    )
}

export default Header