<template>
  <div class="inner-container">
    <div class="header">
      <div class="title">
        分类管理
      </div>
    </div>
    <div class="table">
      <el-table :data="page.records" style="width: 100%">
        <el-table-column prop="name" label="分类名"/>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
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
          @current-change="pageComment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {onMounted, ref, reactive} from "vue";
import {ElMessageBox, ElNotification} from "element-plus";
import {useRouter} from "vue-router";
import type {Result} from "@/interface/result";
import type {Page} from "@/interface/page";
import type {Comment} from "@/interface/comment";

const router = useRouter()
const page = reactive<Page<Comment>>({
  records: [],
  current: 0,
  pages: 0
})
let hidePageComponent = ref(false)

onMounted(() => {
  pageComment(1);
})

function handleDelete(articleId: string) {
  ElMessageBox.confirm(
      '确定要删除这个分类吗？(关联的文章不会被删除)',
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

function subDel(commentId: string) {
  axios.delete(`/category/${commentId}`)
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 40021) {
          ElNotification.success("删除成功")
          pageComment(page.current)
        } else {
          ElNotification.error(result.msg as string)
        }
      })
      .catch(e => {
        console.log(e)
      })
}

function pageComment(current: number) {
  axios.get("/category/page", {
        params: {
          page: current,
          pageSize: 10
        }
      }
  )
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 40031) {
          page.records = result.data.records;
          page.current = parseInt(result.data.current);
          page.pages = parseInt(result.data.pages);
          if (page.pages === 0 || page.pages === 1) {
            hidePageComponent.value = true
          }
        } else {
          ElNotification.error(result.msg as string)
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