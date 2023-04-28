import React, { useRef, useEffect } from 'react'
import { BiUser } from "react-icons/bi"
import { AiOutlineLogout } from "react-icons/ai"
import { MdDelete } from "react-icons/md"
import DropDownBottomLinks from './DropDownBottomLinks'
import { userInfoAftreLogin } from '../../../Redux/types'
import { useDeleteAccountMutation, useLogoutMutation } from '../../../Redux/apiHandler'
import { useAppDispatch } from '../../../Redux/store'
import { logout } from '../../../Redux/ReducerHandler'
const dropdownLinks = [
    {
        id: 1,
        name: "Profile",
        icon: <BiUser className='text-[1.7rem]' />
    },
    {
        id: 2,
        name: "Delete",
        icon: <MdDelete className='text-[1.7rem]' />
    },
    {
        id: 3,
        name: "logout",
        icon: <AiOutlineLogout className='text-[1.7rem]' />
    }
]
type info = {
    name: string | null,
    email: string | null,
    pic: string | null,
    userId: string | null,
    createdAt: string | null,
}


type propType = {
    userInfo: info,
}
function DropDown({ userInfo }: propType) {
    const user = useRef<info>({ name: userInfo.name, email: userInfo.email, pic: userInfo.pic, userId: userInfo.userId, createdAt: userInfo.createdAt })
    const [cb, error] = useLogoutMutation()
    const [deleteAccount] = useDeleteAccountMutation()
    const dispatch = useAppDispatch()
    const userDetails = useRef([{
        id: 1,
        key: "ID",
        value: userInfo.userId
    },
    {
        id: 2,
        key: "Name",
        value: userInfo.name
    },
    {
        id: 3,
        key: "Email",
        value: userInfo.email
    },
    {
        id: 4,
        key: "CreateAt",
        value: userInfo.createdAt
    }])

    const callback = async (id: number) => {
        if (id === 1) {
            //TODO:Profile

        }
        else if (id === 2) {
            try {
                const res = await deleteAccount("").unwrap()
                console.log(res)
                if (res) {
                    localStorage.clear()
                    dispatch(logout(""))
                    window.location.reload()
                }
            } catch (err) {
                console.log(err)
            }
        }
        else if (id === 3) {
            try {
                const result = await cb("").unwrap()
                if (result) {
                    localStorage.clear()
                    dispatch(logout(""))
                    window.location.reload()
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <div className="dropdown px-[1rem]  top-[3.8rem] bg-[#161c97a5] rounded-md py-3 fixed z-[3] border-[1px] border-[#0b17c0]">
            <div className="top_wrapper  flex flex-col  items-center overflow-hidden">
                <div className="image_section w-[4rem] h-[4rem]">
                    {user.current.pic && <img src={user.current.pic} className='rounded-full w-full h-full' alt="" />}
                </div>

                <div className="wrapper_info flex flex-col items-center py-2">
                    {userDetails.current.map((item) => {
                        return <div key={item.id} className="id text-[1.3rem] select-none truncate text-[#e6e1e1]"><p className='select-none'>{item.key}: {item.value}</p></div>
                    })}

                </div>
            </div>
            <div className="h-[2px] w-full bg-[#04046a]"></div>
            <div className="divide-green-800 divide-x-2 divide-y-2 divide-solid divide-black"></div>
            <div className="down_wrapper py-1">
                {dropdownLinks.map((item) => {
                    return <DropDownBottomLinks key={item.id} item={item} callback={callback} />
                })}


            </div>
        </div>
    )
}

export default DropDown