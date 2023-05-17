import { useMemo, useEffect, useState } from 'react'
import { Device } from "mediasoup-client"
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Socket } from 'socket.io-client';
import { AppData, Consumer, ConsumerOptions, Transport, TransportOptions } from 'mediasoup-client/lib/types';
import { useAppSelector } from '../Redux/store';
let device: Device;
let producerTransport: Transport<AppData>;
let consumerTransport: Transport<AppData>;
function useMediaSoupWEBRTC(rtpInfo: RtpCapabilities,
    socket: Socket,
    localStream: MediaStream | null,
    audioParams: AppData,
    videoParams: AppData
) {
    const userInfo = useAppSelector(state => state.auth)
    const [remotePeerProducerIds, setRemotePeerProducerIds] = useState<string[]>([])
    const [allTracks, setAllTracks] = useState<{ track: MediaStreamTrack, id: string }[]>([])
    const [userProfileInfo, setUserProfileInfo] = useState<{ prodId: string, name: string, pic: string }[]>([])
    const [allConsumerTransports, setAllConsumerTransports] = useState<{
        consumerTransport: Transport<AppData>,
        serverConsumerTransportId: string | undefined,
        producerId: string,
        consumer: Consumer<AppData>,
    }[]>([])


    console.log({ rtpInfo })
    // TODO: memoized the function
    const memoizedDevice = useMemo(() => {
    }, [rtpInfo, socket])

    const signalNewConsumerTransport = async (remoteProducerId: string) => {
        if (remotePeerProducerIds.includes(remoteProducerId)) {
            return
        }
        else {
            setRemotePeerProducerIds(pre => [...pre, remoteProducerId])
            await socket.emit('createWebRtcTransport', { consumer: true }, ({ params }: { params: TransportOptions }) => {
                if (typeof params === "string") {
                    console.log("error on consumer webrtc tranport", params)
                    return
                }
                console.log(`PARAMS... ${params}`)
                try {
                    consumerTransport = device.createRecvTransport(params)
                } catch (error) {
                    console.log(error)
                    return
                }
                consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                    try {
                        await socket.emit('transport-recv-connect', {
                            dtlsParameters,
                            serverConsumerTransportId: params.id,
                        }, ({ status }: { status: number }) => {
                            console.log("connected receive success", status)
                        })
                        callback()
                    } catch (error: unknown) {
                        const err = error as Error
                        errback(err)
                    }
                })
                connectRecvTransport(consumerTransport, remoteProducerId, params.id)
            })
        }
    }


    const connectRecvTransport = async (consumerTransport: Transport<AppData>, remoteProducerId: string, serverConsumerTransportId: string) => {
        await socket.emit('consume', {
            rtpCapabilities: device.rtpCapabilities,
            remoteProducerId,
            serverConsumerTransportId,
        }, async ({ params }: { params: ConsumerOptions<AppData> }) => {
            if (typeof params === "string") {
                console.log("error in connectRecv Transport", params)
                return
            }
            else {
                console.log(`Consumer Params ${params}`)
                // then consume with the local consumer transport
                // which creates a consumer
                const consumer = await consumerTransport.consume({
                    id: params.id,
                    producerId: params.producerId,
                    kind: params.kind,
                    rtpParameters: params.rtpParameters
                })
                setAllConsumerTransports(pre => [...pre, {
                    consumerTransport,
                    serverConsumerTransportId: params.id,
                    producerId: remoteProducerId,
                    consumer,
                }])

                const { track } = consumer
                if (track.kind === "video") {
                    setAllTracks(pre => {
                        const isAlreadyExists = pre.some(track => track.id === remoteProducerId)
                        if (!isAlreadyExists) {
                            return [{ track, id: remoteProducerId }, ...pre]
                        }
                        else {
                            return pre
                        }
                    })
                }
                socket.emit('consumer-resume', { serverConsumerId: params.id })
            }
        })
    }




    // ==============================================UseEffect==========================================
    useEffect(() => {

        async function WEBRTCConnectionInit() {
            // memoizedDevice
            try {
                device = new Device()
                await device.load({ routerRtpCapabilities: rtpInfo })
                console.log("rtpCapabilities", device.rtpCapabilities)
                socket.emit("createWebRtcTransport", { consumer: false }, async ({ params }: { params: TransportOptions }) => {
                    console.log({ params })
                    if (typeof params === "string") {
                        // TODO:Handler errors
                        return
                    }
                    else {
                        try {
                            console.log("trasport options", params)
                            producerTransport = device.createSendTransport(params)
                        } catch (err) {
                            console.log("error catch in producer transport options", err)
                            return
                        }
                        producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                            try {
                                await socket.emit('transport-connect', {
                                    dtlsParameters,
                                })
                                callback()
                            } catch (error) {
                            }
                        })

                        producerTransport.on('produce', async (parameters, callback, errback) => {
                            console.log("produce parameters", parameters)
                            try {
                                await socket.emit('transport-produce', {
                                    kind: parameters.kind,
                                    rtpParameters: parameters.rtpParameters,
                                    appData: parameters.appData,
                                }, ({ id, producersExist }: { id: string, producersExist: boolean }) => {
                                    callback({ id })
                                    if (producersExist) {
                                        socket.emit('getProducers', (producer_ids: string[]) => {
                                            console.log("get prodcer id array", { producer_ids })
                                            producer_ids.forEach((id: string) => {
                                                signalNewConsumerTransport(id)
                                            })
                                        })
                                    }
                                })
                            } catch (error) {
                                const err = error as Error
                                errback(err)
                            }
                        })
                        const videoProducer = await producerTransport.produce({ ...videoParams, appData: { name: userInfo.name, pic: userInfo.pic } })
                        console.log("tracks", videoProducer.track)
                        videoProducer.on("trackended", () => {
                            console.log("video track is ended")
                        })
                        videoProducer.on("transportclose", () => {
                            console.log("transport is closed")
                        })
                        const audioProducer = await producerTransport.produce({ ...audioParams, appData: { name: userInfo.name, pic: userInfo.pic } })
                        console.log("tracks", audioProducer.track)
                        audioProducer.on("trackended", () => {
                            console.log("audio track is ended")
                        })
                        audioProducer.on("transportclose", () => {
                            console.log("audio transport is closed")
                        })
                    }
                })
            } catch (err) {
                // TODO:handler error
                console.log(err)
            }
        }
        localStream && WEBRTCConnectionInit()
        socket.on("new-producer", ({ producerId, other_info }: { producerId: string, other_info: { name: string, pic: string } }) => {
            console.log({ producerId, other_info })
            signalNewConsumerTransport(producerId)
            setUserProfileInfo(pre => [
                ...pre,
                {
                    name: other_info.name,
                    pic: other_info.pic,
                    prodId: producerId
                }
            ])
        })
    }, [rtpInfo, socket, localStream])
    return { allTracks, userProfileInfo }
}

export default useMediaSoupWEBRTC
