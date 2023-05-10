const { findRoom, isRoomFull, Rooms, addUserInRoom, removeUserFromRoom } = require("../util");
const User = require("../../db/User.Schema");
class SocketController {
    onRoomCreate = ({ roomId, roomName, count, userId, email }, callback, freetalk, socket) => {
        const roomKey = `${roomId},${roomName},${count}`;
        const newRoomCreateInfo = {
            roomFullName: roomKey,
            isAuther: {
                email: email,
                userId
            },
            usersInRoom: []
        };
        Rooms.splice(0, 0, newRoomCreateInfo);
        callback(200);
        freetalk.emit("new_room_added", { ...newRoomCreateInfo, roomFullName: roomName });
    };

    onRoomJoin = async (value, callback, freetalk, socket) => {
        if ((value.email || value.userId) && value.roomName) {
            //TODO: db operations,do separate for test cases
            const getUserFromDB = await User.findOne({ $or: [{ email: value.email }, { userId: value.userId }] });
            if (getUserFromDB) {
                const userInfoFromBD = {
                    name: getUserFromDB.name + " " + getUserFromDB.lname,
                    pic: getUserFromDB.pic,
                    userId: getUserFromDB.userId,
                    sid: socket.id
                };
                const checkRoom = findRoom(value.roomName);
                const isroomFull = isRoomFull(value.roomName);
                // TODO:check user limit in room
                if (isroomFull) {
                    callback(403);
                    return;
                }
                else {
                    console.log({ checkRoom });
                    //TODO:join user after getting all information
                    socket.join(checkRoom.roomId);
                    addUserInRoom(userInfoFromBD, checkRoom.roomName);
                    //Todo Send all user that a new user is added
                    freetalk.emit("newUserAdded", { ...userInfoFromBD, roomName: value.roomName });
                    console.log(Rooms[0]);
                    const roomFull = isRoomFull(value.roomName);
                    callback(200);
                    if (roomFull) {
                        freetalk.emit("isRoomFull", true);
                    }
                }
            }
            else {
                callback(404);
            }
        }
        else {
            callback(400);
        }
    };

    onLeaveRoom = (params,socket,freetalk) => {
        console.log({ params });
        const returnValue = removeUserFromRoom({ ...params }, params.roomName);
        if (returnValue) {
            socket.leave(returnValue.roomId);
            console.log({ freetalk });
        }
        freetalk.emit("on_user_leave_room", { name: params.name, userId: params.userId, sid: params.sid, roomName: params.roomName, pic: params.pic });
        const roomFull = isRoomFull(params.roomName);
        if (roomFull) {
            freetalk.emit("isRoomFull", roomFull);
        }
    };

}
module.exports = new SocketController();