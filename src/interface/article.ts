export interface ArticlePreview {
    articleId: string,
    title: string,
    previewContent: string,
    commentCount: number,
    category: Array<string>,
    tag: Array<string>,
    createTime: Array<number>
}

export interface Article {
    id: string,
    authorId: string,
    title: string,
    content: string,
    category: Array<string>,
    tag: Array<string>,
    createTime: Array<number>,
    updateTime: Array<number>,
}