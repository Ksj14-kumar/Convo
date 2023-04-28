import { useEffect, useRef } from "react";
import MainContainer from "./Pages/MainContainer"
import { io } from "socket.io-client"
import { roomType, userTypeInRoom } from "./Redux/types";
import { useAppDispatch, useAppSelector } from "./Redux/store";
import { addNewRoom, addNewUserInRoom, allRooms, removeCurrentUserFromRoom } from "./Redux/ReducerHandler";
function App() {
  // TODO:change socket URL for prod
  const socket = useRef(io("http://localhost:8080/freeTalk", {
    path: "/freetalk",
    reconnection: false,
  }))
  const dispatch = useAppDispatch()
  useEffect(() => {
    socket.current.on("new_room_added", (newRoom: roomType) => {
      dispatch(addNewRoom(newRoom))
    })
    socket.current.on("allRooms", (rooms: roomType[]) => {
      dispatch(allRooms(rooms))
    })
    socket.current.on("newUserAdded", (newUser: userTypeInRoom & { roomName: string }) => {
      dispatch(addNewUserInRoom(newUser))
    })
    socket.current.on("on_user_leave_room", (leaveUser: userTypeInRoom & { roomName: string }) => {
      dispatch(removeCurrentUserFromRoom(leaveUser))
    })
    return () => {
      socket.current.off("new_room_added")
      socket.current.off("allRooms")
    }
  }, [socket])
  return (
    <div className="App w-full h-screen flex text-[.5rem]">
      <MainContainer socket={socket.current} />
      {/* <Video /> */}
    </div>
  )
}

export default App;