import { userTypeInRoom } from '../../Redux/types';
import LeftSideRoomBottom from './Components/LeftSideRoomBottom';
import LeftSideRoomCenter from './Components/LeftSideRoomCenter';
import LeftSideRoomHeader from './Components/LeftSideRoomHeader';
import { useEffect, useState } from 'react';
type propType = {
    ownTracks: { track: MediaStreamTrack, id: string }[],
    onRoomLeave: () => void,
    localStream: MediaStream,
    isStreamDisabled: (id: number) => void,
    mediaControls: { audio: boolean, video: boolean }
}
function LeftSideOfRoom({ ownTracks, onRoomLeave, localStream, isStreamDisabled, mediaControls }: propType) {
    const [updateLocalStream, setUpdateLocalStream] = useState<MediaStream>(localStream)


    return (
        <div className="left_side flex-[9] mobile:max-w-[100%] max-w-[76%] flex flex-col flex-shrink-0 overflow-hidden">
            <LeftSideRoomHeader onRoomLeave={onRoomLeave} onControllerHandler={isStreamDisabled} controller={mediaControls} />
            {/* <LeftSideRoomCenter ownTracks={ownTracks} controller={controller} /> */}
            <LeftSideRoomBottom userInRoom={ownTracks} localStream={updateLocalStream} />
        </div>
    )
}

export default LeftSideOfRoom