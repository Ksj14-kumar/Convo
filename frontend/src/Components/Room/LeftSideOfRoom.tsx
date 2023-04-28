import { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { userTypeInRoom } from '../../Redux/types';
import LeftSideRoomBottom from './Components/LeftSideRoomBottom';
import LeftSideRoomCenter from './Components/LeftSideRoomCenter';
import LeftSideRoomHeader from './Components/LeftSideRoomHeader';
import { useEffect, useState } from 'react';
type propType = {
    userInRoom: userTypeInRoom[],
    onRoomLeave: () => void,
    userStreams: IAgoraRTCRemoteUser[],
    ownTracks: [IMicrophoneAudioTrack, ICameraVideoTrack]
}
function LeftSideOfRoom({ userInRoom, onRoomLeave, userStreams, ownTracks }: propType) {
    const [controller, setControler] = useState<{ audio: boolean, video: boolean }>({ audio: false, video: false })

    const onControllerHandler = (id: number) => {
        if (id === 1) {
            setControler({
                ...controller,
                video: !controller.video
            })
            ownTracks[1].setEnabled(!controller.video)
        }
        if (id === 0) {
            setControler({
                ...controller,
                audio: !controller.audio
            })
            ownTracks[0].setEnabled(!controller.audio)
        }
    }

    return (
        <div className="left_side flex-[9] mobile:max-w-[100%] max-w-[76%] flex flex-col flex-shrink-0 overflow-hidden">
            <LeftSideRoomHeader onRoomLeave={onRoomLeave} onControllerHandler={onControllerHandler} controller={controller} />
            <LeftSideRoomCenter ownTracks={ownTracks} controller={controller} />
            <LeftSideRoomBottom userInRoom={userInRoom} userStreams={userStreams} ownTracks={ownTracks} />
        </div>
    )
}

export default LeftSideOfRoom