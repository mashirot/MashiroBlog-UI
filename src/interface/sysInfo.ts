export interface SysInfo {
    ownerNickname: string,
    ownerEmailMD5: string,
    ownerProfile: string,
    runDay: number
}

export interface SysDetailInfo {
    ownerNickname: string,
    ownerEmail: string,
    ownerProfile: string,
    articleCount: number,
    commentCount: number,
    unReviewCommentCount: number,
    categoryCount: number,
    tagCount: number,
    runDay: number
}