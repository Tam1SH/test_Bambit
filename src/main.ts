import { createApp } from 'vue';
import store from './stores';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import './index.css';

const app = createApp(App);

app
    .use(VueQueryPlugin)
    .use(store)
    .mount('#app');

