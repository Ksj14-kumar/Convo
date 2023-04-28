import { useState } from "react"
import img1 from "../../../assets/Image/alexandru-zdrobau-BGz8vO3pK8k-unsplash.jpg"
import { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import { AgoraVideoPlayer } from "agora-rtc-react"
import { useAppSelector } from "../../../Redux/store"
type propType = {
    ownTracks: [IMicrophoneAudioTrack, ICameraVideoTrack],
    controller: {
        audio: boolean,
        video: boolean
    }
}
function LeftSideRoomCenter({ ownTracks, controller }: propType) {
    const userInfo = useAppSelector(state => state.auth)
    return (
        <main className="center_room_side flex-1 max-h-[66%] pb-4 flex justify-center items-center">
            <div className={`userProfile_images h-[20rem] w-[20rem] cursor-pointer }`}
            >
                {

                    controller.video ? 
                    ownTracks && <AgoraVideoPlayer  videoTrack={ownTracks[1]} className="w-full h-full rounded-md" />:
                    userInfo.pic && <img src={userInfo.pic} className="w-full h-full rounded-full" alt="" />
                }
            </div>
        </main>
    )
}

export default LeftSideRoomCenter