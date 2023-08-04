export interface Comment {
    id: string,
    articleId: string,
    senderNickname: string,
    senderEmail: string,
    receiverNickname: string,
    receiverEmail: string,
    content: string,
    senderIp: string,
    secret: boolean,
    createTime: Array<number>
}

export interface CommentUpdate {
    id: string,
    content: string,
    status: number,
    secret: boolean,
    deleted: boolean
}