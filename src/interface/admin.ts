export interface Admin {
    id: string,
    username: string,
    email: string,
    token: string
}

export interface AdminInfo {
    id: string,
    username: string,
    nickname: string,
    email: string,
    profile: string,
    createTime: Array<number>
}

export interface AdminLogin {
    username: string,
    password: string
}

export interface AdminUpdate {
    nickname: string,
    password: string,
    email: string,
    profile: string
}