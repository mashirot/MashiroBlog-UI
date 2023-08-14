<template>
  <div class="container">
    <div>
      <ArticlePreviewComponent :previews="page.records"/>
    </div>
    <div class="pagination">
      <el-pagination
          small
          background
          layout="prev, pager, next"
          :hide-on-single-page="hidePageComponent"
          :current-page="page.current"
          :page-count="page.pages"
          @current-change="pageArticle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ArticlePreviewComponent from "@/components/ArticlePreviewComponent.vue";
import axios from "axios";
import type {Result} from "@/interface/result";
import type {Page} from "@/interface/page";
import type {ArticlePreview} from "@/interface/article";
import {onMounted, reactive, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {ElNotification} from "element-plus";

const route = useRoute()
const page = reactive<Page<ArticlePreview>>({
  records: [],
  current: 0,
  pages: 0
})
let hidePageComponent = ref(false)

onMounted(() => {
  pageArticle(1);
})

watch(() => route.params.tagName, (newValue, oldValue) => {
  if (newValue) {
    pageArticle(page.current);
  }
})

function pageArticle(current: number) {
  axios.get(`/tag/${route.params.tagName}`, {
        params: {
          page: current,
          pageSize: 10
        }
      }
  )
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 30031) {
          page.records = result.data.records;
          page.current = parseInt(result.data.current);
          page.pages = parseInt(result.data.pages);
          if (page.pages === 0 || page.pages === 1) {
            hidePageComponent.value = true
          }
        } else {
          ElNotification.error(result.msg)
        }
      }).catch(e => {
        console.log(e)
      }
  )
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  flex-direction: column;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: auto;

  .pagination {
    display: flex;
    margin: 20px 15px;
    justify-content: center;
    text-align: center;
  }
}
</style>