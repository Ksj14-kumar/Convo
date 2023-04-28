import { PayloadAction, createSlice, isAction } from "@reduxjs/toolkit";
import { roomType, userInfoAftreLogin, userTypeInRoom } from "./types";
const initialState: {
    email: string | null,
    pic: string | null,
    name: string | null,
    userId: string | null
    createdAt: string | null
} = {
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
    pic: localStorage.getItem("pic"),
    userId: localStorage.getItem("userId"),
    createdAt: localStorage.getItem("createdAt")
}
const roomInitialState: {
    rooms: roomType[]
} = { rooms: [] }
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setInfo: (state, action: PayloadAction<userInfoAftreLogin>) => {
            localStorage.setItem("name", action.payload.name)
            localStorage.setItem("email", action.payload.email)
            localStorage.setItem("pic", action.payload.pic)
            localStorage.setItem("userId", action.payload.id)
            localStorage.setItem("createdAt", action.payload.createdAt)
            state.email = action.payload.email
            state.name = action.payload.name
            state.pic = action.payload.pic
            state.userId = action.payload.id
            state.createdAt = action.payload.createdAt
        },
        logout: (state, action) => {
            state.createdAt = null
            state.email = null
            state.name = null
            state.pic = null
            state.userId = null
            localStorage.clear()
        },
    }
})
const roomSlice = createSlice({
    name: "rooms",
    initialState: roomInitialState,
    reducers: {
        addNewRoom: (state, action: PayloadAction<roomType>) => {
            state.rooms.splice(0, 0, action.payload)
        },
        allRooms: (state, action: PayloadAction<roomType[]>) => {
            state.rooms = action.payload
        },
        addNewUserInRoom: (state, action: PayloadAction<userTypeInRoom & { roomName: string }>) => {
            const findRoom = state.rooms.findIndex(room => room.roomFullName === action.payload.roomName)
            if (findRoom !== -1) {
                state.rooms[findRoom].usersInRoom.splice(0, 0, action.payload)
            }
        },
        removeCurrentUserFromRoom: (state, action: PayloadAction<Pick<userTypeInRoom,"userId" | "sid"> & { roomName: string }>) => {
            const findRoom = state.rooms.findIndex(room => room.roomFullName === action.payload.roomName)
            if (findRoom !== -1) {
                const userIndexInRoom = state.rooms[findRoom].usersInRoom.findIndex(userIndex => userIndex.userId === action.payload.userId)
                state.rooms[findRoom].usersInRoom.splice(userIndexInRoom, 1)
            }
        }
    }
})
export const authReducer = authSlice.reducer
export const roomSliceReducer = roomSlice.reducer
export const { setInfo, logout } = authSlice.actions
export const { addNewRoom, allRooms, addNewUserInRoom,removeCurrentUserFromRoom } = roomSlice.actions
