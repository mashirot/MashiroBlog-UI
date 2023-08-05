import './assets/base.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import "element-plus/dist/index.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from "axios";
import dayjs from "dayjs";
import arraySupport from "dayjs/plugin/arraySupport";

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

axios.defaults.baseURL = "http://127.0.0.1:8080";

dayjs.extend(arraySupport)

app.mount('#app')
