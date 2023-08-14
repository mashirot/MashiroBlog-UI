<template>
  <div class="container">
    <div class="aside">
      <div class="owner-info">
        <div class="avatar">
          <img :src="avatar" alt="avatar" @click="router.push({name: 'login'})">
        </div>
        <div class="nickname">
          {{ sysInfoStore.sysInfo.ownerNickname }}
        </div>
        <div class="profile">
          {{ sysInfoStore.sysInfo.ownerProfile }}
        </div>
      </div>
      <div class="category">
        <div class="home" @click="router.push({name: 'articlePreview'})">首页</div>
      </div><div class="category">
        <div class="header">分类</div>
        <div class="category-item" v-for="(category) in categories">
          <div @click="handleCategorySel(category.name)">{{ category.name }}</div>
        </div>
      </div>
    </div>
    <div class="main">
      <RouterView/>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from "axios";
import {onMounted, ref} from "vue";
import type {Result} from "@/interface/result";
import type {Category} from "@/interface/category";
import {useSysInfoStore} from "@/stores/counter";
import {ElNotification} from "element-plus";
import {useRouter} from "vue-router";

const sysInfoStore = useSysInfoStore();
const router = useRouter();
let avatar = ref<string>();
let categories = ref<Array<Category>>([]);

onMounted(() => {
  getSysInfo();
  avatar.value = `https://www.gravatar.com/avatar/${sysInfoStore.sysInfo.ownerEmailMD5}`;
})

function handleCategorySel(categoryName: String) {
  router.push({name: 'categoryArticlePreview', params: {categoryName: categoryName}})
}

function getSysInfo() {
  axios.get("/info")
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 50011) {
          sysInfoStore.sysInfo.ownerNickname = result.data.ownerNickname
          sysInfoStore.sysInfo.ownerEmailMD5 = result.data.ownerEmailMD5
          sysInfoStore.sysInfo.ownerProfile = result.data.ownerProfile
          sysInfoStore.sysInfo.runDay = result.data.runDay
        } else if (result.code === 50010) {
          ElNotification.warning(result.msg)
        } else {
          ElNotification.error('Err')
        }
      }).catch(e => {
    console.log(e)
  })
}

(function getCategory() {
  axios.get("/category")
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 40031) {
          categories.value = result.data
        } else if (result.code === 40030) {
          ElNotification.warning(result.msg)
        } else {
          ElNotification.error('Err')
        }
      }).catch(e => {
    console.log(e)
  })
})()

</script>
<style scoped lang="less">
.container {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .aside {
    flex-direction: column;
    width: 250px;
    height: 100%;
    border-right: 1px solid #bebebe;

    .owner-info {
      padding: 10px 25px;

      .avatar {
        padding: 15px 0;
        text-align: center;

        img {
          width: 100px;
          height: 100px;
          border-radius: 50%;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .nickname {
        margin: 0 auto 15px;
        font-size: 20px;
        text-align: center;
      }

      .profile {
        margin: 0 auto 10px;
        font-size: 14px;
        text-align: center;
        color: gray;
      }
    }

    .home {
      height: 25px;
      font-size: 18px;

      &:hover {
        cursor: pointer;
      }
    }

    .category {
      padding: 5px 20px 15px;

      .header {
        padding-bottom: 5px;
        height: 25px;
        font-size: 18px;
        border-bottom: 0.5px solid #bebebe;
      }

      .category-item {
        padding: 15px 20px 0;
        height: 25px;
        font-size: 16px;

        &:hover {
          cursor: pointer;
          color: #000;
        }
      }
    }
  }

  .main {
    display: flex;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>