import { actionType, initialState } from "../types/CreateModalReducerHandler"

export function reducerHandler(state: typeof initialState, action: actionType) {
    switch (action.type) {
        case "room":
            return {
                ...state,
                roomName: action.payload.value
            }

        case "count":
            return {
                ...state,
                count: action.payload.value
            }

        default:
            return state
    }

}