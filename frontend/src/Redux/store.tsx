import { authReducer, roomSliceReducer } from "./ReducerHandler";
import { configureStore } from "@reduxjs/toolkit"
import { api } from "./apiHandler";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        room:roomSliceReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (gdm) => gdm().concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const auth = (state: RootState) => state.auth
