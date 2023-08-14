<template>
  <div class="container">
    <div class="login">
      <div class="title">登录</div>
      <div class="input">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名">
              <template #prepend><i class="bi bi-person"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码">
              <template #prepend><i class="bi bi-lock"></i></template>
            </el-input>
          </el-form-item>
          <div class="button">
            <el-form-item>
              <el-button type="primary" @click="submitForm(loginFormRef)">登录</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import {ref, reactive} from 'vue';
import {useRouter} from 'vue-router';
import {ElNotification} from "element-plus";
import type {FormInstance} from "element-plus";
import type {FormRules} from 'element-plus/lib/components/index.js';
import type {Admin, AdminLogin} from "@/interface/admin";
import type {Result} from "@/interface/result";

const router = useRouter();

const loginFormRef = ref<FormInstance>();
const loginForm = reactive<AdminLogin>({
  username: "",
  password: ""
});
const loginRules = reactive<FormRules<AdminLogin>>({
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 6, max: 20, message: '用户名长度在6-20之间', trigger: 'blur'},
    {validator: checkChinese, trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 30, message: '密码长度在6-30之间', trigger: 'blur'},
    {validator: checkChinese, trigger: 'blur'}
  ],
});

function checkChinese(rule: any, value: any, callback: any) {
  if (!hasNoChinese(value)) {
    callback(new Error("请输入英文及数字"));
  }
  callback();
}

function hasNoChinese(value: string): boolean {
  const reg = /[\u4E00-\u9FA5]/g;
  return value.search(reg) === -1;
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      subLogin()
    }
  })
}

function subLogin() {
  axios.post("/admin/login", loginForm)
      .then(resp => {
        const result = resp.data as Result;
        if (result.code === 10011) {
          const admin = result.data as Admin;
          localStorage.setItem("authToken", admin.token);
          ElNotification.success("登陆成功，即将跳转")
          setTimeout(() => {
            router.push({name: "overview"});
          }, 1500);
        } else {
          ElNotification.error(result.msg);
        }
      }).catch(e => {
        console.log(e);
      }
  );
}
</script>
<style scoped lang="less">
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #E5EAF3;

  .login {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;

    .title {
      margin: 25px auto;
      color: #303030;
      font-size: 32px;
      font-weight: 700;
      line-height: 32px;
    }

    .input {

      .button {
        display: flex;
        justify-content: center;
      }
    }
  }
}

</style>