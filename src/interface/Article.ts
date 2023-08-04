export interface ArticlePreview {
    articleId: string,
    title: string,
    previewContent: string,
    commentCount: number,
    tag: Array<string>,
    createTime: Array<number>
}

export interface Article {
    id: string,
    articleId: string,
    title: string,
    content: string,
    category: Array<string>,
    tag: Array<string>,
    createTime: Array<number>,
    updateTime: Array<number>,
}