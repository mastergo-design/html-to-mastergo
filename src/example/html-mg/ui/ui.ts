import { createApp } from 'vue';
import './global.scss'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';

import App from './App.vue';

const app = createApp(App);
app.use(Antd).mount('#app')