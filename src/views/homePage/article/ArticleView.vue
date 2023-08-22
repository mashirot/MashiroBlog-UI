<template>
  <div class="container">
    <div class="article-show">
      <div class="title">
        {{ article.title }}
      </div>
      <div class="info">
        <div class="author">
          <i class="bi bi-person"></i>
          {{ sysInfoStore.sysInfo.ownerNickname }}
        </div>
        <div class="createTime">
          <i class="bi bi-clock"></i>
          <!--          避免ts检测报错，使用了dayjs的插件，没有问题-->
          {{ dayjs(article.createTime as any).format("YYYY-MM-DD hh:mm:ss") }}
        </div>
        <div class="tag">
          <i class="bi bi-tags"></i>
          <div v-if="article.tag.length === 0" style="display:flex;">
            <div class="no-tag">
              NoTag
            </div>
          </div>
          <div v-else style="display:flex;">
            <div class="tag-item" v-for="(tag) in article.tag" @click="jump2TagArticlePreviewView(tag)">
              {{ tag }}
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <v-md-editor v-model="article.content" mode="preview"></v-md-editor>
      </div>
    </div>
    <div class="comment-show">
      <div class="title">
        评论：
      </div>
      <div class="comment-item" v-if="commentPage.records.length > 0" v-for="(comment) in commentPage.records">
        <div class="header">
          <img :src="`https://www.gravatar.com/avatar/${comment.senderEmailMD5}`" alt="senderAvatar">
          <div class="info">
            <div class="sender">
              <div v-if="!comment.receiverNickname">
                {{ comment.senderNickname }}
              </div>
              <div v-else>
                {{ comment.senderNickname }}
                <span class="reply">reply</span>
                {{ comment.receiverNickname }}
              </div>
            </div>
            <div class="sendTime">
              {{ dayjs(comment.createTime as any).format("YYYY-MM-DD hh:mm:ss") }}
            </div>
          </div>
          <el-button size="small" style="margin-left: auto;" @click="handleReply(comment)">回复</el-button>
        </div>
        <div class="commentContent">
          <v-md-editor v-model="comment.content" mode="preview"></v-md-editor>
        </div>
      </div>
      <div v-else class="no-comment">
        暂无评论
      </div>
      <el-pagination
          small
          background
          layout="prev, pager, next"
          :hide-on-single-page="hidePageComponent"
          :current-page="commentPage.current"
          :page-count="commentPage.pages"
          @current-change="pageComment"
      />
    </div>
    <div class="comment-form">
      <div v-if="!isReply">
        <div class="title">
          发布评论：
        </div>
        <CommentReleaseComponent :articleId="articleId"/>
      </div>
      <div v-else>
        <div class="title">
          回复：{{ reply2.receiverNickname }}
          <el-button style="margin-left: 15px;" size="small" @click="handleCancelReply">取消回复</el-button>
        </div>
        <CommentReleaseComponent :articleId="reply2.articleId" :commentSubForm="reply2"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import dayjs from "dayjs";
import {useRoute, useRouter} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {ElNotification} from "element-plus";
import type {Result} from "@/interface/result";
import type {Article} from "@/interface/article";
import type {CommentSubmit, CommentView} from "@/interface/comment";
import type {Page} from "@/interface/page";
import CommentReleaseComponent from "@/components/CommentReleaseComponent.vue";
import {useSysInfoStore} from "@/stores/counter";

const route = useRoute()
const router = useRouter()
const articleId = route.params.articleId as string;

const sysInfoStore = useSysInfoStore();
let article = reactive<Article>({
  id: "",
  authorId: "",
  title: "",
  content: "",
  category: [],
  tag: [],
  createTime: [],
  updateTime: [],
})
const commentPage = reactive<Page<CommentView>>({
  records: [],
  current: 0,
  pages: 0
})
const hidePageComponent = ref<Boolean>(false)
const isReply = ref<Boolean>(false)
const reply2 = reactive<CommentSubmit>({
  articleId: "",
  senderNickname: "",
  senderEmail: "",
  receiverNickname: null,
  replyCommentId: null,
  content: "",
  secret: false
})

onMounted(() => {
  getArticle()
  pageComment(1)
})

function jump2TagArticlePreviewView(tagName: string) {
  router.push({name: 'tagArticlePreview', params: {tagName: tagName}})
}

function handleCancelReply() {
  isReply.value = false
}

function handleReply(comment: CommentView) {
  isReply.value = true
  reply2.articleId = comment.articleId
  reply2.replyCommentId = comment.id
  reply2.receiverNickname = comment.senderNickname
}

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
        } else if (result.code === 20040) {
          router.back()
        } else {
          ElNotification.error('Network Err')
          router.back()
        }
      })
      .catch()
}

function pageComment(current: number) {
  axios.get(`/comment/art/${articleId}`, {
        params: {
          page: current,
          pageSize: 10
        }
      }
  )
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 60041) {
          commentPage.records = result.data.records
          commentPage.current = parseInt(result.data.current)
          commentPage.pages = parseInt(result.data.pages)
          if (commentPage.pages === 0 || commentPage.pages === 1) {
            hidePageComponent.value = true
          }
        } else if (result.code === 60040) {
          ElNotification.warning(result.msg as string)
        } else {
          ElNotification.error('Network Err')
        }
      })
      .catch()
}

</script>

<style scoped lang="less">
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 30px 50px;
  overflow: auto;

  .article-show {

    .title {
      font-size: 36px;
      font-weight: 700;
    }

    .info {
      display: flex;
      align-items: center;
      font-size: 14px;
      border-bottom: 1px solid #cdcdcd;

      div {
        margin: 10px;
      }

      .tag {
        display: flex;
        font-size: 12px;

        i {
          display: flex;
          align-items: center;
          line-height: 12px;
          vertical-align: bottom;
        }

        div {
          margin: 0;
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
    }

    .content {
      padding: 10px 0;
    }
  }

  .comment-show {
    flex-direction: column;
    border-top: 1px solid #bebebe;

    .title {
      margin: 15px 5px;
      font-size: 18px;
    }

    .comment-item {
      margin: 0 20px;

      .header {
        display: flex;
        margin: 10px 0 0;
        align-items: center;
        font-size: 16px;

        img {
          height: 36px;
          vertical-align: center;
        }

        .info {
          display: flex;
          margin-left: 10px;
          flex-direction: column;

          .reply {
            //font-size: 14px;
            margin: 0 5px;
          }

          .sendTime {
            font-size: 12px;
          }
        }
      }

      .commentContent {
        margin: 0 25px;
      }
    }

    .no-comment {
      margin: 40px;
      text-align: center;
      font-size: 20px;
      color: #7b7b7b;
    }
  }

  .comment-form {

    .title {
      display: flex;
      margin: 0 0 15px;
    }
  }
}
</style>