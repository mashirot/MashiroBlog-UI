<template>
  <div class="container">
    <div class="aside">
      <div class="owner-info">
        <div class="avatar">
          <img :src="avatar" alt="avatar">
        </div>
        <div class="nickname">
          {{ sysInfo?.ownerNickname }}
        </div>
        <div class="profile">
          {{ sysInfo?.ownerProfile }}
        </div>
      </div>
      <div class="category">
        <div class="header">分类</div>
        <div class="category-item" v-for="(category) in categories">
          {{ category.name }}
        </div>
      </div>
    </div>
    <div class="main">
      <RouterView/>
    </div>
  </div>
</template>
<script setup lang="ts">
import md5 from 'crypto-js/md5';
import axios from "axios";
import {onMounted, reactive, ref} from "vue";
import type {Result} from "@/interface/result";
import type {SysInfo} from "@/interface/sysInfo";
import type {Category} from "@/interface/category";

let avatar = ref<string>();
let sysInfo = ref<SysInfo>({
  ownerNickname: "",
  ownerEmail: "",
  ownerProfile: "",
  articleCount: 0,
  commentCount: 0,
  runDay: 0
});
let categories = reactive<Array<Category>>([]);

onMounted(() => {
  getSysInfo();
  const email = sysInfo.value.ownerEmail?.trim().toLowerCase();
  const avatarEmailMD5 = md5(email!).toString();
  avatar.value = `https://www.gravatar.com/avatar/${avatarEmailMD5}`;
})

function getSysInfo() {
  axios.get("/info")
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 50011) {
          sysInfo.value = result.data
        } else {
          console.log(result.msg)
        }
      }).catch(e => {
        console.log(e)
      }
  )
}

(function getCategory() {
  axios.get("/category")
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 40031) {
          categories = result.data
        } else {
          console.log(result.msg)
        }
      })
      .catch();
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

    .category {
      padding: 20px 20px 15px;

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