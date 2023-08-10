<template>
  <div class="container">
    <div class="form">
      <el-form ref="articleFormRef" :model="article" :rules="rules">
        <el-form-item prop="title">
          <div class="title">标题：</div>
          <el-input v-model="article.title"/>
        </el-form-item>
        <el-form-item prop="content">
          <div class="content">正文：</div>
          <v-md-editor v-model="article.content" height="800px"></v-md-editor>
        </el-form-item>
        <el-form-item prop="category" label="分类：">
          <el-tag
              v-for="category in article.category"
              :key="category"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="handleCategoryClose(category)"
          >
            {{ category }}
          </el-tag>
          <el-input
              v-if="categoryInputVisible"
              ref="InputRef"
              v-model="categoryInputValue"
              class="ml-1 w-20"
              style="width: 100px;"
              size="small"
              @keyup.enter="handleCategoryInputConfirm"
              @blur="handleCategoryInputConfirm"
          />
          <el-button v-else class="button-new-tag ml-1" size="small" @click="showCategoryInput">
            + New Category
          </el-button>
        </el-form-item>
        <el-form-item prop="tag" label="标签：">
          <el-tag
              v-for="tag in article.tag"
              :key="tag"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="handleTagClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
              v-if="tagInputVisible"
              ref="InputRef"
              v-model="tagInputValue"
              class="ml-1 w-20"
              style="width: 100px;"
              size="small"
              @keyup.enter="handleTagInputConfirm"
              @blur="handleTagInputConfirm"
          />
          <el-button v-else class="button-new-tag ml-1" size="small" @click="showTagInput">
            + New Tag
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button">
      <el-button @click="router.back()">取消</el-button>
      <el-button type="primary" @click="submitForm(articleFormRef)">提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">

import {nextTick, ref, reactive} from 'vue'
import {ElInput, ElNotification} from 'element-plus'
import type {FormRules, FormInstance} from 'element-plus'
import axios from "axios";
import type {Article} from "@/interface/article";
import type {Result} from "@/interface/result";
import {useRouter} from "vue-router";

const router = useRouter();
const props = defineProps({
  article: {
    type: Object,
    default: {
      id: "",
      authorId: "",
      title: "",
      content: "",
      category: [],
      tag: [],
      createTime: [],
      updateTime: [],
    }
  },
  type: {
    type: String,
    required: true
  }
});

const article = ref<Article>(props.article as Article)

const categoryInputValue = ref('')
const tagInputValue = ref('')
const categoryInputVisible = ref(false)
const tagInputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const articleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<Article>>({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 1, max: 200, message: 'Length should be 1 to 200', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      subArticle()
    } else {
      console.log('error submit!', fields)
    }
  })
}

function subArticle() {
  if (props.type === 'put') {
    axios.put('/article', article.value)
        .then(resp => {
          const result = resp.data as Result
          if (result.code === 20031) {
            ElNotification.success('修改成功')
            router.push({name: 'articleManage'})
          } else if (result.code === 20030) {
            ElNotification.warning(result.msg as string)
          } else {
            ElNotification.error('Network Err')
          }
        })
        .catch(e => {
          console.log(e)
        });
  } else if (props.type === 'post') {
    axios.post('/article', article.value)
        .then(resp => {
          const result = resp.data as Result
          if (result.code === 20011) {
            ElNotification.success('新增成功')
            router.push({name: 'articleManage'})
          } else if (result.code === 20010) {
            ElNotification.warning(result.msg as string)
          } else {
            ElNotification.error('Network Err')
          }
        })
        .catch(e => {
          console.log(e)
        });
  } else {
    console.log('err')
  }
}

const handleCategoryClose = (tag: string) => {
  article.value.category.splice(article.value.category.indexOf(tag), 1)
}

const showCategoryInput = () => {
  categoryInputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleCategoryInputConfirm = () => {
  if (categoryInputValue.value) {
    article.value.category.push(categoryInputValue.value)
  }
  categoryInputVisible.value = false
  categoryInputValue.value = ''
}

const handleTagClose = (tag: string) => {
  article.value.tag.splice(article.value.tag.indexOf(tag), 1)
}

const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleTagInputConfirm = () => {
  if (tagInputValue.value) {
    article.value.tag.push(tagInputValue.value)
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}
</script>

<style scoped lang="less">
.container {
  margin: 25px;

  .button {
    margin-top: 25px;
    text-align: center;
  }

}
</style>