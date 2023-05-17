const { MEDIASOUP_OPTIONS } = require("./config")
const mediasoup = require("mediasoup")
class MediaSoup_Controller {

    constructor() {
        this.worker = null
        this.roomWithRouterAndName = {} //{roomName:{router:Router, peers:[sid, sid, sid]}}
        this.peers = {} // each peers transports, producerTranport, and consumerTransport, socket, info
        this.allTransport = []  //{ socketId: socket.id, transport, roomName, consumer, }
        this.allProducers = [] //{socketId, producer, roomName}
        this.allconsumers = []
    }

    addTransport = (transport, roomName, isConsumer, socket) => {
        //Global Tranport + peer transport
        this.allTransport.push({ socketId: socket.id, roomName, transport, isConsumer })
        this.peers[socket.id] = {
            ...this.peers[socket.id],
            p_transports: [
                ...this.peers[socket.id].p_transports,
                transport.id
            ]
        }
    }

    addProducer = (sid, producer, roomName, socket) => {
        //Global producer Tranport + peer producer transport
        this.allProducers.push({ socketId: sid, producer, roomName, })

        this.peers[socket.id] = {
            ...this.peers[socket.id],
            p_producers: [
                ...this.peers[socket.id].p_producers,
                producer.id,
            ]
        }
    }

    addConsumer = (consumer, roomName, socket) => {
        this.allconsumers.push({ socketId: socket.id, roomName, consumer })
        this.peers[socket.id] = {
            ...this.peers[socket.id],
            p_consumers: [
                ...this.peers[socket.id].p_consumers,
                consumer.id
            ]
        }
    }

    informConsumers = (roomName, socketId, producer_id, appData) => {
        console.log(`just joined, producer_id ${producer_id} ${roomName}, ${socketId}`)
        // A new producer just joined
        // let all consumers to consume this producer
        this.allProducers.forEach(producerData => {
            if (producerData.socketId !== socketId && producerData.roomName === roomName) {
                const producerSocket = this.peers[producerData.socketId].p_socket
                // use socket to send producer producer_id to producer
                producerSocket.emit('new-producer', { producerId: producer_id, other_info: appData })
            }
        })
    }
    getTransport = (socketId) => {
        const transportSocket = this.allTransport.find(transport => transport.socketId === socketId && !transport.isConsumer)
        console.log(`get transport ${transportSocket}`)
        return transportSocket.transport
    }
    onCreateWorker = async () => {
        try {
            this.worker = await mediasoup.createWorker(MEDIASOUP_OPTIONS.WORKER_OPTIONS)
            this.worker.on("died", (er) => {
                console.log(`a wroker is died ${err}`)
            })
            return this.worker
        } catch (err) {
            console.log(err)
        }
    }
    createRoom_WEBRTC_Router = async (roomName, roomId, sid, count) => {
        try {
            let room_router;
            console.log(roomName, roomId, sid)
            const newRoomName = `${roomName}`
            if (this.roomWithRouterAndName[newRoomName]) {
                room_router = this.roomWithRouterAndName[newRoomName].router
            }
            else {
                room_router = await this.worker.createRouter({ mediaCodecs: MEDIASOUP_OPTIONS.ROUTER_OPTIONS })
            }
            this.roomWithRouterAndName[newRoomName] = {
                router: room_router,
                peersId: []
            }
            return room_router
        } catch (err) {
            console.log(`error on create router ${err}`,)
        }
    }


    addPeerInRoom = async (value, socket) => {// PREVIEW: add users in rooms
        this.roomWithRouterAndName[value.roomName] = {
            ...this.roomWithRouterAndName[value.roomName],
            peersId: [...(this.roomWithRouterAndName[value.roomName]?.peersId), socket.id]
        }
        this.peers[socket.id] = {
            roomName: value.roomName,
            p_transports: [],
            p_producers: [],
            p_consumers: [],
            p_socket: socket,
            p_info: {
                name: value.name,
                pic: value.pic,
                userId: value.userId,
                email: value.email
            }
        }
        const rtpCapabilities = this.roomWithRouterAndName[value.roomName].router.rtpCapabilities
        return rtpCapabilities
    }
    onCreateWebRTCTransport = async (socket) => {
        const roomName = this.peers[socket.id].roomName
        const routerOfCurrentRoom = this.roomWithRouterAndName[roomName]?.router
        return new Promise(async (resolve, reject) => {
            try {
                let transport;
                transport = await routerOfCurrentRoom.createWebRtcTransport(MEDIASOUP_OPTIONS.WEBRTCTRANSPORT_OPTIONS);
                console.log(`transport id: ${transport.id}`)
                transport.on('dtlsstatechange', dtlsState => {
                    if (dtlsState === 'closed') {
                        transport.close()
                    }
                })

                transport.on('close', () => {
                    console.log('transport closed')
                })
                resolve([transport, roomName])
            } catch (err) {
                reject(err)
            }
        })
    }

    connectProducer = async (kind, rtpParameters, socket, callback, appData) => {
        const producer = await this.getTransport(socket.id).produce({
            kind,
            rtpParameters,
        })
        const { roomName } = this.peers[socket.id]
        this.addProducer(socket.id, producer, roomName, socket)
        this.informConsumers(roomName, socket.id, producer.id, appData)
        console.log('Producer ID: ', producer.id, producer.kind)
        producer.on('transportclose', () => {
            console.log('transport for this producer closed ')
            producer.close()
        })
        callback({
            id: producer.id,
            producersExist: this.allProducers.length > 1 ? true : false
        })
    }

    getProducers = (socket, callback) => {
        const { roomName } = this.peers[socket.id]
        let producerList = []
        this.allProducers.forEach(producerData => {
            console.log(`producer ids ${producerData}`)
            if (producerData.socketId !== socket.id && producerData.roomName === roomName) {
                // producerList = [...producerList, producerData.producer.id]
                producerList.push(producerData.producer.id)
            }
        })
        callback(producerList)
    }
    connectReceiveTransport = async (socket, dtlsParameters, serverConsumerTransportId, callback) => {
        console.log(`transport receive options ${serverConsumerTransportId}, ${dtlsParameters}`)
        console.log(`DTLS PARAMS: ${dtlsParameters}`)
        console.log(`all transports ${this.allTransport}`)
        const consumerTransport = this.allTransport.find(transportData => {
            console.log(`transport connect receive ${transportData}- ${transportData.transport.id}===${serverConsumerTransportId}`)
            return transportData.isConsumer && transportData.transport.id == serverConsumerTransportId
        }).transport
        await consumerTransport.connect({ dtlsParameters })
    }

    onConsume = async (socket, serverConsumerTransportId, remoteProducerId, rtpCapabilities, callback) => {
        try {
            const { roomName } = this.peers[socket.id]
            const router = this.roomWithRouterAndName[roomName].router
            let consumerTransport = this.allTransport.find(transportData => (
                transportData.isConsumer && transportData.transport.id === serverConsumerTransportId
            )).transport
            // check if the router can consume the specified producer
            if (router.canConsume({
                producerId: remoteProducerId,
                rtpCapabilities
            })) {
                // transport can now consume and return a consumer
                const consumer = await consumerTransport.consume({
                    producerId: remoteProducerId,
                    rtpCapabilities,
                    paused: true,
                })
                consumer.on('transportclose', () => {
                    console.log('transport close from consumer')
                })
                consumer.on('producerclose', () => {
                    console.log('producer of consumer closed')
                    socket.emit('producer-closed', { remoteProducerId })

                    consumerTransport.close([])
                    this.allTransport = this.allTransport.filter(transportData => transportData.transport.id !== consumerTransport.id)
                    consumer.close()
                    this.allconsumers = this.allconsumers.filter(consumerData => consumerData.consumer.id !== consumer.id)
                })
                this.addConsumer(consumer, roomName, socket)
                console.log(`${consumer.id}, ${consumer.kind}, ${consumer.rtpParameters}`)
                const params = {
                    id: consumer.id,
                    producerId: remoteProducerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters
                }
                console.log(`consume transort video ${params}`);
                callback({ params })
            }
        } catch (err) {
            callback({ params: err })
        }
    }

    consumeStart = async (serverConsumerId) => {
        console.log('consumer resume')
        const takeConsumer = this.allconsumers.find(consumerData => {
            console.log(`consumer consume start ${serverConsumerId}-${consumerData.consumer.id}`)
            return consumerData.consumer.id == serverConsumerId
        }).consumer
        await takeConsumer.resume()
    }
}


module.exports = new MediaSoup_Controller()