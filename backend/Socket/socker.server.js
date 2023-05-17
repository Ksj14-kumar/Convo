const { Server } = require("socket.io");
const { onRoomCreate, onRoomJoin, onLeaveRoom } = require("./Controller/SocketControler");
const { Rooms } = require("./util");
const { onCreateWorker, createRoom_WEBRTC_Router, addPeerInRoom, roomWithRouterAndName, peers, onCreateWebRTCTransport, addTransport, getTransport, allProducers, connectProducer, getProducers, connectReceiveTransport, onConsume, consumeStart } = require("./MediaSoup/Controller");

module.exports = (server) => {
    const io = new Server(server, {
        path: "/freetalk",
        cors: {
            origin: "*"
        }
    });
    const freetalk = io.of("/freeTalk");
    freetalk.on("connection", (socket) => {
        console.log("a user is connected...");
        let roomNameUpdate = [];
        Rooms.forEach(item => {
            roomNameUpdate.push({ ...item, roomFullName: item.roomFullName.split(",")[1] });
        });

        //DONE: a Worker is create and load\ Worker for room
        onCreateWorker()
        socket.emit("allRooms", roomNameUpdate);
        socket.on("new_room_create", async ({ roomId, roomName, count, userId, email }, callback) => {
            // DONE: Socket room
            onRoomCreate({ roomId, roomName, count, userId, email }, callback, freetalk, socket);
            //DONE: WEBRTC Router for Room
            await createRoom_WEBRTC_Router(roomName, roomId, socket.id, count)
        });
        socket.on("on_join", async (value, callback) => {
            // DONE: rtpCapabilities for room from Router
            const rtpCapabilities = await addPeerInRoom(value, socket)
            //DONE: Successfull room Join Socket
            onRoomJoin(value, callback, freetalk, socket, rtpCapabilities);
        });
        socket.on("on_room_leave", (params) => {
            onLeaveRoom(params, socket, freetalk);
        });
        // DONE: WEBRTC Transport
        socket.on("createWebRtcTransport", ({ consumer }, callback) => {
            onCreateWebRTCTransport(socket)
                .then((resolveValue) => {
                    const [transport, roomName] = resolveValue
                    addTransport(transport, roomName, consumer, socket)
                    console.log({
                        id: transport.id,
                        iceParameters: transport.iceParameters,
                        iceCandidates: transport.iceCandidates,
                        dtlsParameters: transport.dtlsParameters,
                    })
                    callback({
                        params: {
                            id: transport.id,
                            iceParameters: transport.iceParameters,
                            iceCandidates: transport.iceCandidates,
                            dtlsParameters: transport.dtlsParameters,
                        }
                    })
                })
                .catch((err) => {
                    console.log(`error on create webrtc Transport ${err}`)
                    callback({ params: err })
                })
        })
        socket.on("transport-connect", async ({ dtlsParameters }) => {
            const transport = getTransport(socket.id)
            transport.connect({ dtlsParameters })
        })
        socket.on("transport-produce", async ({ kind, rtpParameters, appData }, callback) => {
            // TODO: Task  remainings...... Tomorrow
            await connectProducer(kind, rtpParameters, socket, callback, appData)
        })

        socket.on("getProducers", async (callback) => {
            await getProducers(socket, callback)
        })
        socket.on("transport-recv-connect", async ({ dtlsParameters, serverConsumerTransportId }, callback) => {
            await connectReceiveTransport(socket, dtlsParameters, serverConsumerTransportId, callback)
        })

        socket.on("consume", async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }, callback) => {
            console.log(`"rtpCapabilities",${rtpCapabilities}`)
            await onConsume(socket, serverConsumerTransportId, remoteProducerId, rtpCapabilities, callback)
        })

        socket.on("consumer-resume", async ({ serverConsumerId }) => {
            console.log(`consumer-resume ${serverConsumerId}`)
            await consumeStart(serverConsumerId)
        })
        socket.on("disconnect", (msg) => {
            console.log("a user is disconnected");
        });
    });
};