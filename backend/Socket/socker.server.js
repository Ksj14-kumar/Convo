const { Server } = require("socket.io");
const { onRoomCreate, onRoomJoin, onLeaveRoom } = require("./Controller/SocketControler");
const { Rooms } = require("./util");
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
        socket.emit("allRooms", roomNameUpdate);
        socket.on("new_room_create", ({ roomId, roomName, count, userId, email }, callback) => {
            console.log({ roomId, roomName, userId, email });
            onRoomCreate({ roomId, roomName, count, userId, email }, callback, freetalk, socket);
        });

        socket.on("on_join", async (value, callback) => {
            console.log({ value });
            onRoomJoin(value, callback, freetalk, socket);
        });
        console.log(socket);
        socket.on("on_room_leave", (params) => {
            onLeaveRoom(params, socket, freetalk);
        });
        socket.on("disconnect", (msg) => {
            console.log("a user is disconnected");
        });
    });
};