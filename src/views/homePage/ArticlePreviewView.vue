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
          :current-page="page.current"
          :page-count="page.total"
          @current-change="pageArticle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ArticlePreviewComponent from "@/components/ArticlePreviewComponent.vue";
import axios from "axios";
import type {Result} from "@/interface/Result";
import type {Page} from "@/interface/page";
import type {ArticlePreview} from "@/interface/Article";
import {onMounted, reactive} from "vue";

const page = reactive<Page<ArticlePreview>>({
  records: [],
  current: 0,
  total: 0
})

onMounted(() => {
  pageArticle(1);
})

function pageArticle(current: number) {
  axios.get("/article/page", {
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
          page.total = parseInt(result.data.pages)
        }
      })
      .catch()
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