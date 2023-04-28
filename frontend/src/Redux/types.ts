export type userInfoAftreLogin = {
    name: string,
    email: string,
    pic: string,
    id: string,
    createdAt: string
}


export type userTypeInRoom = {
    name: string,
    pic: string,
    userId: string,
    sid:string
}
export type roomType = {
    roomFullName: string,
    isAuther: {
        email: string,
        userId: string
    },
    usersInRoom: userTypeInRoom[]
}