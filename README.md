# MashiroBlog

一套前后端分离的博客项目，后端使用Java，Kotlin混合开发，前端采用Vue+TypeScript

## 项目介绍

本项目是博客的前端，使用Vue3+Ts，VueRouter，Pinia，ElementPlus开发

本人定位为后端开发，前端只是能看的程度，对于页面设计、美化等并不熟悉

## 部署

1. clone项目

   `git clone https://github.com/mashirot/MashiroBlog.git`

2. 配置

    修改`src/main.ts`中的`axios.defaults.baseURL`为后端地址

3. 打包

    `npm run build`

4. 托管

    将`./dist`文件夹中的文件放到Nginx的对应目录下