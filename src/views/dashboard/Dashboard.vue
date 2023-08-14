<template>
  <el-container>
    <el-aside>
      <el-row class="tac">
        <el-col :span="12">
          <el-menu :default-active="route.path" router :default-openeds="['article', 'comment']">
            <el-menu-item index="/dashboard" @click="router.push({name: 'overview'})">
              <span>概况</span>
            </el-menu-item>
            <el-sub-menu index="article">
              <template #title>
                <span>文章管理</span>
              </template>
              <el-menu-item index="/dashboard/article"><span>文章列表</span></el-menu-item>
              <el-menu-item index="/dashboard/article/trash"><span>回收站</span></el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="comment">
              <template #title>
                <span>评论管理</span>
              </template>
              <el-menu-item index="/dashboard/comment"><span>评论列表</span></el-menu-item>
              <el-menu-item index="/dashboard/comment/unreviewed"><span>待审核评论</span></el-menu-item>
              <el-menu-item index="/dashboard/comment/trash"><span>回收站</span></el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
    <el-main>
      <RouterView/>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {useSysInfoStore} from "@/stores/counter";
import {onMounted} from "vue";
import axios from "axios";
import type {Result} from "@/interface/result";
import {useRoute, useRouter} from "vue-router";
import {ElNotification} from "element-plus";

const route = useRoute();
const router = useRouter();
const sysInfoStore = useSysInfoStore();

onMounted(() => {
  getSysInfo()
})

function getSysInfo() {
  axios.get("/info/detail")
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 50011) {
          const data = result.data;
          sysInfoStore.sysDetail.ownerNickname = data.ownerNickname;
          sysInfoStore.sysDetail.ownerEmail = data.ownerEmail;
          sysInfoStore.sysDetail.ownerProfile = data.ownerProfile;
          sysInfoStore.sysDetail.articleCount = parseInt(data.articleCount);
          sysInfoStore.sysDetail.commentCount = parseInt(data.commentCount);
          sysInfoStore.sysDetail.unReviewCommentCount = parseInt(data.unReviewCommentCount);
          sysInfoStore.sysDetail.categoryCount = parseInt(data.categoryCount);
          sysInfoStore.sysDetail.tagCount = parseInt(data.tagCount);
        } else {
          ElNotification.warning(result.msg)
        }
      }).catch(e => {
        console.log(e)
      }
  )
}
</script>

<style scoped lang="less">
.el-container {
  position: absolute;
  width: 100%;
  height: 100%;

  .el-aside {
    width: 200px;
    height: 100%;
    border-right: 1px solid #bebebe;

    .el-menu {
      width: 199px;
      border: 0;
    }

    span {
      margin-left: 30px;
    }
  }
}
</style>