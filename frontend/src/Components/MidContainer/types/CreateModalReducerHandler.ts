export const initialState: {
    roomName: string, count: string
} = { roomName: "", count: "unlimited" }

export type actionType = {
    type: "room" | "count",
    payload: {
        value: string
    }
}