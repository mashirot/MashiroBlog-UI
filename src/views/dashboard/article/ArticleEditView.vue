<template>
  <div class="inner-container">
    <div class="title">
      修改：{{ article.title }}
    </div>
    <el-divider/>
    <ArticleEditComponent :article="article" type="put"/>
  </div>
</template>

<script setup lang="ts">
import ArticleEditComponent from "@/components/ArticleEditComponent.vue";
import axios from "axios";
import {useRoute} from "vue-router";
import {onMounted, reactive} from "vue";
import {ElNotification} from "element-plus";
import type {Result} from "@/interface/result";
import type {Article} from "@/interface/article";

const route = useRoute();
const articleId = route.params.articleId;
const article = reactive<Article>({
  id: "",
  authorId: "",
  title: "",
  content: "",
  category: [],
  tag: [],
  createTime: [],
  updateTime: [],
})

onMounted(() => {
  getArticle();
})

function getArticle() {
  axios.get(`/article/${articleId}`)
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 20041) {
          const data = result.data as Article;
          article.id = data.id
          article.authorId = data.authorId
          article.title = data.title
          article.content = data.content
          article.category = data.category
          article.tag = data.tag
          article.createTime = data.createTime
          article.updateTime = data.updateTime
        } else {
          ElNotification.error('Network Err')
        }
      })
      .catch()
}
</script>

<style scoped lang="less">
.inner-container {
  position: relative;

  .title {
    margin-left: 10px;
    font-size: 24px;
    font-weight: 700;
  }
}
</style>