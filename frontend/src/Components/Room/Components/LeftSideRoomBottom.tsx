import img1 from "../../../assets/Image/alexandru-zdrobau-BGz8vO3pK8k-unsplash.jpg"
import img2 from "../../../assets/Image/valerie-elash-JQDflNNnrEE-unsplash.jpg"
import img3 from "../../../assets/Image/tengyart-pNq5uxt-f7k-unsplash.jpg"
import img4 from "../../../assets/Image/tengyart-nGLXaFoW-oY-unsplash.jpg"
import img5 from "../../../assets/Image/tamara-bellis-JTtWu85K9So-unsplash.jpg"
import img6 from "../../../assets/Image/stefan-stefancik-QXevDflbl8A-unsplash.jpg"
import img7 from "../../../assets/Image/roksolana-zasiadko-LyeduBb2Auk-unsplash.jpg"
import User from "./User"
import { useEffect, useState } from "react"
type propType = {
    userInRoom: { track: MediaStreamTrack, id: string }[],
    localStream: MediaStream
}
function LeftSideRoomBottom({ userInRoom, localStream }: propType) {
    const [mic, setMic] = useState<boolean>(false)
    const onMicDisabledAndEnabled = () => {
        setMic(pre => !pre)
    }
    // console.log({ userStreams })

    const userListWithStream = []
    return (
        <footer className="bottom_room_side pt-[.5rem] px-[8px] flex justify-center items-center border-t border-[#2c1ec4] overflow-y-hidden overflow-x-auto w-full gap-x-2 whitespace-nowrap">
            <div className="wrapperImage flex overflow-auto gap-x-4 pb-2" id="room_users_scrollbar">
                {userInRoom?.map((usersStream) => {
                    return <div key={usersStream.id} className="imagwr">
                        <User item={usersStream.track} mic={mic} onMicDisabledAndEnabled={onMicDisabledAndEnabled} />
                    </div>
                    // if (usersStream.hasVideo || usersStream.hasAudio) {
                    // }
                    // else {
                    //     return null
                    // }
                })}
                {
                    localStream && <User item={localStream.getVideoTracks()[0]} mic={mic} onMicDisabledAndEnabled={onMicDisabledAndEnabled}/>
                }

            </div>
        </footer>
    )
}

export default LeftSideRoomBottom