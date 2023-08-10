<template>
  <div class="title">
    新增文章
  </div>
  <el-divider/>
  <ArticleEditComponent type="post"/>
</template>

<script setup lang="ts">
import ArticleEditComponent from "@/components/ArticleEditComponent.vue";
</script>

<style scoped lang="less">
.title {
  margin-left: 10px;
  font-size: 24px;
  font-weight: 700;
}
</style>