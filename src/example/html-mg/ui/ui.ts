import { createApp } from 'vue';
import './global.scss'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';

import App from './App.vue';

const app = createApp(App);
app.use(Antd).mount('#app')

type Independent = 'x'
type NotA<T> = T extends Independent? never: T
type NotB<T> = Independent extends T ? never : T

type NotX<T> = NotA<T> & NotB<T>

type a = {
  [key in Exclude<string, Independent>]: string;
} | { x: number }

let abc: a = {
  x: '1',
  y: '',
}