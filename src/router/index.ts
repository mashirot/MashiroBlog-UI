import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'homePage',
      component: () => import('@/views/HomePage.vue'),
      children: [
        {
          path: '',
          name: 'articlePreview',
          component: () => import('@/views/homePage/ArticlePreviewView.vue')
        },
        {
          path: 'article/:articleId',
          name: 'article',
          component: () => import('@/views/homePage/ArticleView.vue')
        },
      ]
    }
  ]
})

export default router
