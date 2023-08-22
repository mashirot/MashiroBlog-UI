<template>
  <div class="container">
    <div class="article-preview-item" v-for="(preview) in previews as Array<ArticlePreview>">
      <div class="title" @click="jump2ArticleDetail(preview.articleId)">
        {{ preview.title }}
      </div>
      <div class="tag">
        <i class="bi bi-tags-fill"></i>
        <div v-if="preview.tag.length === 0" style="display:flex;">
          <div class="no-tag">
            NoTag
          </div>
        </div>
        <div v-else style="display:flex;">
          <div class="tag-item" v-for="(tag) in preview.tag" @click="jump2TagArticlePreviewView(tag)">
            {{ tag }}
          </div>
        </div>
      </div>
      <div class="content" @click="jump2ArticleDetail(preview.articleId)">
        {{ preview.previewContent }}
      </div>
      <div class="footer">
        <div class="author">
          <i class="bi bi-person"></i>
          {{ sysInfoStore.sysInfo.ownerNickname }}
        </div>
        <div class="createTime">
          <i class="bi bi-clock"></i>
          {{ dayjs(preview.createTime as any).format("YYYY-MM-DD hh:mm:ss") }}
        </div>
        <div class="commentCount">
          <i class="bi bi-chat-left-text"></i>
          <div v-if="preview.commentCount === 0">
            暂无评论
          </div>
          <div v-else>
            {{ preview.commentCount }}条评论
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {ArticlePreview} from '@/interface/article';
import dayjs from "dayjs";
import {useRouter} from "vue-router";
import {useSysInfoStore} from "@/stores/counter";

const router = useRouter()
const sysInfoStore = useSysInfoStore()

defineProps({
  previews: Array<ArticlePreview>
})

function jump2ArticleDetail(articleId: string) {
  router.push({name: 'article', params: {articleId: articleId}})
}

function jump2TagArticlePreviewView(tagName: string) {
  router.push({name: 'tagArticlePreview', params: {tagName: tagName}})
}

</script>

<style lang="less" scoped>
.container {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;

  .article-preview-item {
    margin: 25px 25px 0;
    box-sizing: border-box;

    .title {
      margin: 10px 5px;
      font-size: 20px;
      font-weight: 550;

      &:hover {
        cursor: pointer;
      }
    }

    .tag {
      display: flex;
      flex-direction: row;
      margin: 10px;
      font-size: 12px;
      color: #cccccc;
      line-height: 12px;

      i {
        padding: 4px;
        width: auto;
        height: 12px;
        line-height: 12px;
        vertical-align: bottom;
      }

      .no-tag {
        display: flex;
        justify-content: left;
        padding: 5px;
        margin: 0 5px;
        height: 12px;
        text-align: center;
        background-color: #f6f6f6;
        border-radius: 5px;
      }

      .tag-item {
        display: flex;
        justify-content: left;
        padding: 5px;
        margin: 0 5px;
        height: 12px;
        text-align: center;
        background-color: #f6f6f6;
        border-radius: 5px;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .content {
      margin: 15px;
      color: #3d3d3d;

      &:hover {
        cursor: pointer;
      }
    }

    .footer {
      margin: 10px;
      display: flex;
      font-size: 14px;
      color: #a6a6a6;

      div {
        display: inline-block;
        margin: 0 5px;
      }

      i {
        margin: 0 3px;
        vertical-align: bottom;
      }
    }
  }
}
</style>