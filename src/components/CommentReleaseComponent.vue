<template>
  <el-form ref="commentFormRef" :model="commentForm" :rules="commentFormRule">
    <el-form-item prop="content" label="评论：">
      <v-md-editor v-model="commentForm.content" height="200px"></v-md-editor>
    </el-form-item>
    <div class="nickname-email">
      <el-form-item prop="senderNickname" label="昵称：">
        <el-input v-model="commentForm.senderNickname"/>
      </el-form-item>
      <el-form-item prop="senderEmail" label="邮箱：">
        <el-input v-model="commentForm.senderEmail"/>
      </el-form-item>
      <el-form-item label="私密评论">
        <el-switch v-model="commentForm.secret"/>
      </el-form-item>
    </div>
    <div class="button">
      <el-form-item>
        <el-button type="primary" @click="handlerSubmit(commentFormRef)">评论</el-button>
        <el-button @click="resetForm(commentFormRef)">清空</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import axios from "axios";
import {reactive, ref} from "vue";
import {ElNotification} from "element-plus";
import type {FormRules, FormInstance} from "element-plus";
import type {Result} from "@/interface/result";
import type {CommentSubmit} from "@/interface/comment";

const props = defineProps({
  articleId: {
    type: String,
    default: "",
    required: true
  },
  commentSubForm: {
    type: Object,
    default: {
      articleId: "",
      senderNickname: "",
      senderEmail: "",
      receiverNickname: null,
      replyCommentId: null,
      content: "",
      secret: false
    }
  }
});

const commentFormRef = ref<FormInstance>()
const commentForm = ref<CommentSubmit>(props.commentSubForm as CommentSubmit)
const commentFormRule = reactive<FormRules<CommentSubmit>>({
  content: [
    {required: true, message: '请输入评论内容', trigger: 'blur'},
  ],
  senderNickname: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
    {min: 1, max: 20, message: '长度在 1 到 20', trigger: 'blur'},
  ],
  senderEmail: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {pattern: /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入合法邮箱', trigger: 'blur'},
    {min: 5, max: 30, message: '长度在 5 到 30', trigger: 'blur'},
  ]
})

function subComment(formEl: FormInstance) {
  commentForm.value.articleId = props.articleId
  console.log(commentForm.value)
  axios.post("/comment", commentForm.value)
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 60011) {
          ElNotification.success("评论成功，审核后显示")
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

function resetForm(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped lang="less">
.el-form {

  .nickname-email {
    display: flex;
    flex-direction: row;

    :deep(.el-form-item:nth-child(1)) {
      margin-right: 10px;
    }

    :deep(.el-form-item:nth-child(3)) {
      margin-left: auto;
    }
  }

  .button {
    display: flex;
  }
}
</style>