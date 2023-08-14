<template>
  <div class="inner-container">
    <div class="header">
      <div class="title">
        文章管理
      </div>
      <div class="btn">
        <el-button @click="handleInsert">新增文章</el-button>
      </div>
    </div>
    <div class="table">
      <el-table :data="page.records" style="width: 100%">
        <el-table-column prop="title" label="标题"/>
        <el-table-column label="分类">
          <template #default="scope">
            <div v-if="scope.row.category.length > 0">
              {{ scope.row.category.join(", ") }}
            </div>
            <div v-else>
              无
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建日期">
          <template #default="scope">
            {{ dayjs(scope.row.createTime as any).format("YYYY-MM-DD hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row.articleId)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.articleId)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
import axios from "axios";
import dayjs from "dayjs";
import {onMounted, ref, reactive} from "vue";
import {ElMessageBox, ElNotification} from "element-plus";
import {useRouter} from "vue-router";
import type {Result} from "@/interface/result";
import type {Page} from "@/interface/page";
import type {ArticlePreview} from "@/interface/article";

const router = useRouter()
const page = reactive<Page<ArticlePreview>>({
  records: [],
  current: 0,
  pages: 0
})
let hidePageComponent = ref(false)

onMounted(() => {
  pageArticle(1);
})

function handleInsert() {
  router.push({name: 'articleInsert'})
}

function handleDelete(articleId: string) {
  ElMessageBox.confirm(
      '确定要删除这篇文章吗？',
      'Warning',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    subDel(articleId)
  })
}

function handleEdit(articleId: string) {
  router.push({name: 'articleEdit', params: {'articleId': articleId}})
}

function subDel(articleId: string) {
  axios.delete(`/article/${articleId}`)
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 20021) {
          ElNotification.success("删除成功")
          pageArticle(page.current)
        } else if (result.code === 20020) {
          ElNotification.warning(result.msg as string)
        } else {
          ElNotification.error("Network Err")
        }
      })
      .catch(e => {
        console.log(e)
      })
}

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
          page.pages = parseInt(result.data.pages);
          if (page.pages === 0 || page.pages === 1) {
            hidePageComponent.value = true
          }
        } else if (result.code === 30030) {
          ElNotification.warning(result.msg as string)
        } else {
          ElNotification.error("Network Err")
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
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;

  .header {
    display: flex;
    flex-direction: row;
    width: 100%;

    .title {
      font-size: 24px;
      font-weight: 700;
    }

    .btn {
      margin-left: auto;
      margin-right: 75px;
    }
  }

  .table {
    margin: 20px auto 40px;
    text-align: center;
    width: 100%;
  }
}
</style>