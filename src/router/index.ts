import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'homePage',
            component: () => import('@/views/homePage/HomePage.vue'),
            children: [
                {
                    path: '',
                    name: 'articlePreview',
                    component: () => import('@/views/homePage/article/ArticlePreviewView.vue')
                },
                {
                    path: 'category/:categoryName',
                    name: 'categoryArticlePreview',
                    component: () => import('@/views/homePage/article/CategoryArticlePreviewView.vue')
                },
                {
                    path: 'tag/:tagName',
                    name: 'tagArticlePreview',
                    component: () => import('@/views/homePage/article/TagArticlePreviewView.vue')
                },
                {
                    path: 'article/:articleId',
                    name: 'article',
                    component: () => import('@/views/homePage/article/ArticleView.vue')
                },
            ]
        },
        {
            path: '/dashboard',
            name: 'dashBoard',
            component: () => import('@/views/dashboard/Dashboard.vue'),
            children: [
                {
                    path: '',
                    name: 'overview',
                    component: () => import('@/views/dashboard/OverviewView.vue')
                },
                {
                    path: 'article',
                    name: 'articleManage',
                    component: () => import('@/views/dashboard/article/ArticleManageView.vue')
                },
                {
                    path: 'article/edit/:articleId',
                    name: 'articleEdit',
                    component: () => import('@/views/dashboard/article/ArticleEditView.vue')
                },
                {
                    path: 'article/ins',
                    name: 'articleInsert',
                    component: () => import('@/views/dashboard/article/ArticleInsertView.vue')
                },
                {
                    path: 'article/trash',
                    name: 'articleTrashBin',
                    component: () => import('@/views/dashboard/article/ArticleTrashBinView.vue')
                },
                {
                    path: 'comment',
                    name: 'commentManage',
                    component: () => import('@/views/dashboard/comment/CommentManageView.vue')
                },
                {
                    path: 'comment/unreviewed',
                    name: 'commentUnreviewed',
                    component: () => import('@/views/dashboard/comment/CommentUnreviewedView.vue')
                },
                {
                    path: 'comment/trash',
                    name: 'commentTrashBin',
                    component: () => import('@/views/dashboard/comment/CommentTrashBinView.vue')
                },
            ]
        }
    ]
})

export default router
