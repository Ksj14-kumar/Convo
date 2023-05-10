class Socket_util {
    constructor() {
        this.Rooms = [];
    }
    findRoom = (roomName) => {
        const roomIndex = this.Rooms.findIndex(item => item.roomFullName.split(",")[1] === roomName);
        console.log({ roomIndex });
        if (roomIndex !== -1) {
            return {
                ...this.Rooms[roomIndex],
                roomName,
                roomId: this.Rooms[roomIndex].roomFullName.split(",")[0],
                count: this.Rooms[roomIndex].roomFullName.split(",")[2]
            };
        }
    };
    addUserInRoom = (userInfo, roomName) => {
        const roomIndex = this.Rooms.findIndex(item => item.roomFullName.split(",")[1] === roomName);
        if (roomIndex !== -1) {
            const result = this.Rooms[roomIndex].usersInRoom.splice(0, 0, userInfo);
            return result;
        }
    };
    removeUserFromRoom = (userInfo, roomName) => {
        const roomIndex = this.Rooms.findIndex(item => item.roomFullName.split(",")[1] === roomName);
        if (roomIndex !== -1) {
            const userIndexInRoom = this.Rooms[roomIndex].usersInRoom.findIndex(item => item.userId === userInfo.userId && item.sid === userInfo.sid);
            if (userIndexInRoom !== -1) {
                const result = this.Rooms[roomIndex].usersInRoom.splice(userIndexInRoom, 1)[0];
                const roomId = this.Rooms[roomIndex].roomFullName.split(",")[0];
                return { ...result, roomId };
            }
        }
    };

    isRoomFull = (roomName) => {
        const findRoomUserCount = this.findRoom(roomName);
        if (findRoomUserCount) {
            if (findRoomUserCount.count !== "unlimited" && findRoomUserCount.usersInRoom.length === +findRoomUserCount.count) {
                return true;

            }
            else {
                return false;
            }
        }
    };

}


module.exports = new Socket_util();