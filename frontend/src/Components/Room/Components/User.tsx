import { useEffect, useRef } from 'react'
import { BsFillMicFill, BsMicMuteFill } from "react-icons/bs"
import { userTypeInRoom } from '../../../Redux/types'
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import { AgoraVideoPlayer } from 'agora-rtc-react'
type propType = {
    item: MediaStreamTrack,
    onMicDisabledAndEnabled: () => void,
    mic: boolean
}
function User({ item, onMicDisabledAndEnabled, mic }: propType) {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        if (videoRef.current) {
            console.log(item)
            videoRef.current.srcObject = new MediaStream([item])
        }
    }, [item, videoRef])

    // const userImage= typeof item.uid ==="string" &&JSON.parse(item.uid)
    return (
        <div className="user_profile bg-green-400 rounded-md relative text-[1.2rem]">
            <div className="image object-cover w-[8rem] rounded-md h-[8rem] flex justify-center items-center cursor-pointer flex-shrink-0">
                {/* {
                    (item.hasVideo && item.videoTrack) ?
                        <AgoraVideoPlayer videoTrack={item.videoTrack} config={{ mirror: true, fit: "cover" }} className='w-full h-full rounded-md' /> :
                        <img src={userImage.pic} className='shrink-0 flex-shrink-0 object-cover w-full rounded-md h-full' alt="" />
                } */}
                <video className='w-full h-full' autoPlay controls ref={videoRef}></video>
            </div>
            <div className="mic absolute bottom-1 right-2 z-[2]">
                <div className="button">
                    <button className='rounded-full p-2 bg-[#e9e5e56d]'
                        onClick={() => {
                            onMicDisabledAndEnabled()
                        }}
                    >
                        {
                            mic ?
                                <BsFillMicFill className='text-[1.4rem]' /> :
                                <BsMicMuteFill className='text-[1.4rem]' />
                        }
                    </button>
                </div>
            </div>
            <div className="name_wrapper absolute bottom-0 left-0 truncate overflow-hidden bg-[#1312124e] w-full pl-2">
                {/* <p className='text-[#ffffff] truncate'>{item.name}</p> */}
            </div>
        </div>
    )
}

export default User