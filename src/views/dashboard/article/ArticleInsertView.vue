<template>
  <div class="inner-container">
    <div class="title">
      新增文章
    </div>
    <el-divider/>
    <ArticleEditComponent type="post"/>
  </div>
</template>

<script setup lang="ts">
import ArticleEditComponent from "@/components/ArticleEditComponent.vue";
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