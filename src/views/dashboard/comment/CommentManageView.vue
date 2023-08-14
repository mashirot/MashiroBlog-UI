<template>
  <div class="container">
    <div class="header">
      <div class="title">
        评论管理
      </div>
    </div>
    <div class="table">
      <el-table :data="page.records" style="width: 100%">
        <el-table-column prop="senderEmail" label="邮箱"/>
        <el-table-column prop="senderNickname" label="昵称"/>
        <el-table-column label="文章">
          <template #default="scope">
            <el-button type="text" @click="jump2Article(scope.row.articleId)">文章</el-button>
          </template>
        </el-table-column>
        <el-table-column label="回复">
          <template #default="scope">
            <div v-if="scope.row.receiverNickname === null">
              楼主
            </div>
            <div v-else>
              {{ scope.row.receiverNickname }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容"/>
        <el-table-column prop="senderIp" label="IP"/>
        <el-table-column prop="secret" label="是否私密"/>
        <el-table-column label="创建日期">
          <template #default="scope">
            {{ dayjs(scope.row.createTime as any).format("YYYY-MM-DD hh:mm:ss") }}
          </template>
        </el-table-column>
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
import dayjs from "dayjs";
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

function jump2Article(articleId: string) {
  const path = router.resolve(`/article/${articleId}`);
  window.open(path.href)
}

function handleDelete(articleId: string) {
  ElMessageBox.confirm(
      '确定要删除这条评论吗？',
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
  axios.delete(`/comment/${commentId}`)
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 60021) {
          ElNotification.success("删除成功")
          pageComment(page.current)
        } else if (result.code === 60020) {
          ElNotification.warning(result.msg as string)
        } else {
          ElNotification.error("Network Err")
        }
      })
      .catch(e => {
        console.log(e)
      })
}

function pageComment(current: number) {
  axios.get("/comment/page", {
        params: {
          page: current,
          pageSize: 10
        }
      }
  )
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 60041) {
          page.records = result.data.records;
          page.current = parseInt(result.data.current);
          page.pages = parseInt(result.data.pages);
          if (page.pages === 0 || page.pages === 1) {
            hidePageComponent.value = true
          }
        } else if (result.code === 60040) {
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
.container {
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