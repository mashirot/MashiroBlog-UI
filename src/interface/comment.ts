export interface Comment {
    id: string,
    articleId: string,
    senderNickname: string,
    senderEmail: string,
    content: string,
    senderIp: string,
    secret: boolean,
    createTime: Array<number>
}

export interface CommentSubmit {
    articleId: string,
    senderNickname: string,
    senderEmail: string,
    content: string,
    secret: boolean,
}

export interface CommentView {
    id: string,
    articleId: string,
    senderNickname: string,
    senderEmailMD5: string,
    content: string,
    createTime: Array<number>
}

export interface CommentUpdate {
    id: string,
    content: string,
    status: number,
    secret: boolean,
    deleted: boolean
}