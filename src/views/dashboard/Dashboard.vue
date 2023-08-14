<template>
  <el-container class="container">
    <el-header>
      <div class="dashboard-title">
        MashiroBlog
      </div>
      <el-dropdown>
        <div class="admin">
          <i class="bi bi-person"></i>
          <span>{{ adminStore.admin.username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleOpenAdminInfo">个人资料</el-dropdown-item>
            <el-dropdown-item @click="handleOpenAdminUpdate">修改资料</el-dropdown-item>
            <el-dropdown-item @click="subLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-container class="main">
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
  </el-container>
  <el-dialog
      v-model="adminInfoDialogVisible"
      title="个人信息"
      width="50%"
  >
    <el-descriptions style="margin: 0 15px;" :column="1" border>
      <el-descriptions-item label="Id">{{ adminInfo.id }}</el-descriptions-item>
      <el-descriptions-item label="Username">{{ adminInfo.username }}</el-descriptions-item>
      <el-descriptions-item label="Nickname">{{ adminInfo.nickname }}</el-descriptions-item>
      <el-descriptions-item label="Email">{{ adminInfo.email }}</el-descriptions-item>
      <el-descriptions-item label="Profile">{{ adminInfo.profile }}</el-descriptions-item>
      <el-descriptions-item label="CreateTime">{{
          dayjs(adminInfo.createTime as any).format("YYYY-MM-DD hh:mm:ss")
        }}
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="adminInfoDialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="adminUpdateDialogVisible"
      title="修改信息"
      width="50%"
  >
    <el-form ref="adminUpdateFormRef" :model="adminUpdateForm" :rules="adminUpdateFormRule" class="update-form">
      <el-form-item prop="nickname" label="昵称">
        <el-input v-model="adminUpdateForm.nickname"/>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="adminUpdateForm.password"/>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="adminUpdateForm.email"/>
      </el-form-item>
      <el-form-item prop="profile" label="简介">
        <el-input v-model="adminUpdateForm.profile"/>
      </el-form-item>
      <div class="button">
        <el-form-item>
          <el-button @click="resetForm(adminUpdateFormRef)">重置</el-button>
          <el-button type="primary" @click="submitForm(adminUpdateFormRef)">提交</el-button>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="adminUpdateDialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import axios from "axios";
import dayjs from "dayjs";
import {onMounted, ref, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useAdminStore, useSysInfoStore} from "@/stores/counter";
import {ElNotification} from "element-plus";
import type {FormInstance, FormRules} from "element-plus";
import type {Result} from "@/interface/result";
import type {AdminInfo, AdminUpdate} from "@/interface/admin";

const route = useRoute();
const router = useRouter();
const sysInfoStore = useSysInfoStore();
const adminStore = useAdminStore();

const adminInfoDialogVisible = ref<Boolean>(false);
const adminUpdateDialogVisible = ref<Boolean>(false);
const adminInfo = ref<AdminInfo>({
  id: '',
  username: '',
  nickname: '',
  email: '',
  profile: '',
  createTime: [],
});
const adminUpdateFormRef = ref<FormInstance>();
const adminUpdateForm = reactive<AdminUpdate>({
  nickname: "",
  password: "",
  email: "",
  profile: ""
});
const adminUpdateFormRule = reactive<FormRules<AdminUpdate>>({
  nickname: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
    {min: 1, max: 20, message: '长度在 1 到 20', trigger: 'blur'}
  ],
  password: [
    {required: false, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 30, message: '长度在 6 到 30', trigger: 'blur'}
  ],
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {pattern: /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入合法邮箱', trigger: 'blur'},
    {min: 5, max: 30, message: '长度在 5 到 30', trigger: 'blur'}
  ],
  profile: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
    {min: 1, max: 500, message: '长度在 1 到 500', trigger: 'blur'}
  ]
})

onMounted(() => {
  getSysInfo()
})

function subUpdate(formEl: FormInstance) {
  axios.put('/admin', adminUpdateForm)
      .then(resp => {
        const result = resp.data as Result;
        if (result.code === 10041) {
          adminUpdateDialogVisible.value = false;
          resetForm(formEl)
          ElNotification.success('修改成功');
        } else {
          ElNotification.error(result.msg as string);
        }
      })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      subUpdate(formEl)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

function handleOpenAdminUpdate() {
  getAdminUpdateInfo();
  adminUpdateDialogVisible.value = true;
}

function getAdminUpdateInfo() {
  axios.get('/admin')
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 10031) {
          adminUpdateForm.nickname = result.data.nickname
          adminUpdateForm.email = result.data.email
          adminUpdateForm.profile = result.data.profile
        } else {
          ElNotification.error(result.msg as string)
        }
      })
      .catch(e => {
        console.log(e)
      })
}

function handleOpenAdminInfo() {
  getAdminInfo();
  adminInfoDialogVisible.value = true;
}

function getAdminInfo() {
  axios.get('/admin')
      .then(resp => {
        let result = resp.data as Result
        if (result.code === 10031) {
          adminInfo.value = result.data
        } else {
          ElNotification.error(result.msg as string)
        }
      })
      .catch(e => {
        console.log(e)
      })
}

function subLogout() {
  axios.get('/admin/logout')
      .then(resp => {
        const result = resp.data as Result
        if (result.code === 10021) {
          adminStore.admin.id = ''
          adminStore.admin.username = ''
          adminStore.admin.email = ''
          adminStore.admin.token = ''
          localStorage.clear()
          ElNotification.success(result.data)
          router.push({name: 'articlePreview'})
        } else {
          ElNotification.error(result.msg as string)
        }
      })
      .catch(e => {
        console.log(e)
      })
}

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
          ElNotification.warning(result.msg as string)
        }
      }).catch(e => {
        console.log(e)
      }
  )
}
</script>

<style scoped lang="less">
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .el-header {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid #bebebe;

    .dashboard-title {
      color: #8D9095;
      font-size: 30px;
      font-weight: 700;
    }

    .el-dropdown {
      margin-left: auto;

      .admin {
        display: flex;
        padding: 10px;
        background-color: #fefefe;
        border: 1.5px solid #e1e1e1;
        border-radius: 5px;

        &:hover {
          cursor: default;
        }

        span {
          margin: 0 5px;
        }
      }
    }
  }

  .main {
    position: relative;
    width: 100%;
    box-sizing: border-box;

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

}

.update-form {
  margin: 0 50px;

  .button {
    display: flex;
    justify-content: center;
  }
}
</style>