import './assets/base.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import "element-plus/dist/index.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from "axios";
import dayjs from "dayjs";
import arraySupport from "dayjs/plugin/arraySupport";
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// 行号
import createLineNumberPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
// 复制
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

import Prism from 'prismjs';

import App from './App.vue'
import router from './router'

const app = createApp(App)

VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});

VueMarkdownEditor.use(createLineNumberPlugin())
VueMarkdownEditor.use(createCopyCodePlugin());

app.use(createPinia())
app.use(router)
app.use(VueMarkdownEditor);

axios.defaults.baseURL = "http://127.0.0.1:8080";

dayjs.extend(arraySupport)

app.mount('#app')
