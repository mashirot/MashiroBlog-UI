<template>
  <div class="inner-container">
    <div class="info">
      <el-row>
        <el-col :span="4">
          <el-statistic title="文章数量" :value="sysDetail.articleCount"/>
        </el-col>
        <el-col :span="4">
          <el-statistic title="评论数量" :value="sysDetail.commentCount"/>
        </el-col>
        <el-col :span="4">
          <el-statistic title="待审核评论" :value="sysDetail.unReviewCommentCount"/>
        </el-col>
        <el-col :span="4">
          <el-statistic title="分类数量" :value="sysDetail.categoryCount"/>
        </el-col>
        <el-col :span="4">
          <el-statistic title="标签数量" :value="sysDetail.tagCount"/>
        </el-col>
      </el-row>
    </div>
    <el-divider/>
    <div class="detail">
      <div class="recent-article">
        <div class="title">
          最近发布的文章
        </div>
        <div class="article-title" v-for="article in page.records as Array<ArticlePreview>">
          <span class="date">{{ dayjs(article.createTime as any).format("MM-DD") }}</span>
          <el-divider direction="vertical"/>
          <span class="art-title" @click="jump2Article(article.articleId)">{{ article.title }}</span>
        </div>
      </div>
      <div class="recent-comment">
        <div class="title">
          最近得到的回复
        </div>
        <div class="comment-preview" v-for="comment in commentPage.records as Array<CommentView>">
          <span class="date">{{ dayjs(comment.createTime as any).format("MM-DD") }}</span>
          <el-divider direction="vertical"/>
          {{ comment.senderNickname }}： {{ comment.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import dayjs from "dayjs";
import {onMounted, reactive} from "vue";
import {useSysInfoStore} from "@/stores/counter";
import {useRouter} from "vue-router";
import {storeToRefs} from 'pinia';
import type {Result} from "@/interface/result";
import type {Page} from "@/interface/page";
import type {ArticlePreview} from "@/interface/article";
import type {CommentView} from "@/interface/comment";

const router = useRouter();
const sysInfoStore = useSysInfoStore();
const {sysDetail} = storeToRefs(sysInfoStore);

let page = reactive<Page<ArticlePreview>>({
  records: [],
  current: 0,
  pages: 0
})
let commentPage = reactive<Page<CommentView>>({
  records: [],
  current: 0,
  pages: 0
})

onMounted(() => {
  pageArticle()
  pageComment()
})

function jump2Article(articleId: string) {
  const path = router.resolve(`/article/${articleId}`);
  window.open(path.href)
}

function pageArticle() {
  axios.get("/article/page", {
        params: {
          page: 1,
          pageSize: 10
        }
      }
  )
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 30031) {
          const data = result.data as Page<ArticlePreview>;
          page.records = data.records;
          page.pages = data.pages;
          page.current = data.current;
        }
      }).catch(e => {
        console.log(e)
      }
  )
}

function pageComment() {
  axios.get(`/comment/page`, {
        params: {
          page: 1,
          pageSize: 10
        }
      }
  )
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 60041) {
          const data = result.data as Page<CommentView>;
          commentPage.records = data.records;
          commentPage.pages = data.pages;
          commentPage.current = data.current;
        }
      }).catch(e => {
        console.log(e)
      }
  )
}
</script>

<style scoped lang="less">
.inner-container {
  position: relative;
  width: 100%;

  .info {
    margin: 20px 0;

    .el-col {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      height: 75px;
      text-align: center;
      border: 1px solid #E4E7ED;
    }
  }

  .detail {
    display: flex;
    justify-content: space-evenly;

    .title {
      margin: 10px 0;
      font-size: 18px;
    }

    .date {
      color: #909399;
    }

    .article-title {
      font-size: 14px;

      .art-title {
        color: #467B96;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .comment-preview {
      font-size: 14px;
    }
  }
}
</style>