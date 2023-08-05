<template>
  <div class="container">
    <div class="article">
      <div class="title">
        {{ article.title }}
      </div>
      <div class="info">
        <div class="author">
          <i class="bi bi-person"></i>
          Author
        </div>
        <div class="createTime">
          <i class="bi bi-clock"></i>
          {{ dayjs(article.createTime).format("YYYY-MM-DD hh:mm:ss") }}
        </div>
        <div class="tag">
          <i class="bi bi-tags"></i>
          <div v-if="article.tag.length === 0" style="display:flex;">
            <div class="tag-item">
              NoTag
            </div>
          </div>
          <div v-else style="display:flex;">
            <div class="tag-item" v-for="(tag) in article.tag">
              {{ tag }}
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        {{ article.content }}
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
              {{ comment.senderNickname }}
            </div>
            <div class="sendTime">
              {{ dayjs(comment.createTime).format("YYYY-MM-DD hh:mm:ss") }}
            </div>
          </div>
        </div>
        <div class="commentContent">
          {{ comment.content }}
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
      <div class="title">
        发布评论：
      </div>
      <el-form ref="commentFormRef" :model="commentForm" :rules="commentFormRule">
        <el-form-item prop="content" label="评论：">
          <el-input v-model="commentForm.content" type="textarea"/>
        </el-form-item>
        <div class="nickname-email">
          <el-form-item prop="senderNickname" label="昵称：">
            <el-input v-model="commentForm.senderNickname"/>
          </el-form-item>
          <el-form-item prop="senderEmail" label="邮箱：">
            <el-input v-model="commentForm.senderEmail"/>
          </el-form-item>
        </div>
        <div class="button">
          <el-form-item>
            <el-button type="primary" @click="handlerSubmit(commentFormRef)">评论</el-button>
            <el-button @click="resetForm(commentFormRef)">清空</el-button>
          </el-form-item>
          <el-form-item label="私密评论">
            <el-switch v-model="commentForm.secret"/>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {ElNotification} from "element-plus";
import type {FormRules, FormInstance} from "element-plus";
import type {Result} from "@/interface/Result";
import type {Article} from "@/interface/Article";
import type {CommentView, CommentSubmit} from "@/interface/Comment";
import type {Page} from "@/interface/page";
import dayjs from "dayjs";

const route = useRoute()
const router = useRouter()
const articleId = route.params.articleId as string;

let article = reactive<Article>({
  id: "",
  articleId: "",
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
const hidePageComponent = ref(false)
const commentFormRef = ref<FormInstance>()
const commentForm = reactive<CommentSubmit>({
  articleId: articleId,
  senderNickname: "",
  senderEmail: "",
  content: "",
  secret: false
})
const commentFormRule = reactive<FormRules<CommentSubmit>>({
  content: [
    { required: true, message: '请输入评论内容', trigger: 'blur' },
  ],
  senderNickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20', trigger: 'blur' },
  ],
  senderEmail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入合法邮箱', trigger: 'blur' },
    { min: 5, max: 30, message: '长度在 5 到 30', trigger: 'blur' },
  ]
})

onMounted(() => {
  getArticle()
  pageComment(1)
})

function subComment(formEl: FormInstance) {
  axios.post("/comment", commentForm)
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 60011) {
          ElNotification.success("评论成功，审核后显示")
          pageComment(1)
          resetForm(formEl)
        } else if (result.code === 60010) {
          ElNotification.warning(result.msg as string)
        } else {
          ElNotification.error('Network Err')
        }
      })
      .catch()
}

async function handlerSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      subComment(formEl)
    } else {
      ElNotification.warning('请输入合法参数')
    }
  })
}

function resetForm (formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.resetFields()
}

function getArticle() {
  axios.get(`/article/${articleId}`)
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 20041) {
          article = result.data
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

  .article {

    .title {
      font-size: 24px;
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

        .tag-item {
          display: inline-block;
          justify-content: left;
          margin: 0 5px;
          padding: 5px;

          height: 12px;
          line-height: 12px;
          text-align: center;
          background-color: #f6f6f6;
          border-radius: 5px;
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
      margin: 0 20px 25px;

      .header {
        display: flex;
        margin: 10px 0;
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

          .sendTime {
            font-size: 12px;
          }
        }
      }

      .commentContent {
        margin: 0 50px;
      }
    }

    .no-comment {
      text-align: center;
      font-size: 20px;
      color: #7b7b7b;
    }
  }

  .comment-form {

    .title {
      margin: 0 0 15px;
    }

    .nickname-email {
      display: flex;
      flex-direction: row;

      :deep(.el-form-item:nth-child(1)) {
        margin-right: 10px;
      }
    }

    .button {
      display: flex;

      :deep(.el-form-item:nth-child(2)) {
        margin-left:auto;
      }
    }
  }
}
</style>