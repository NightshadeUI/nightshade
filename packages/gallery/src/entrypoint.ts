import '@nightshadeui/stylesheets';
import '@nightshadeui/core/css';
import './theme.css';

import * as NightshadeCore from '@nightshadeui/core/src';
import { createApp } from 'vue';

import RootView from './RootView.vue';

const app = createApp(RootView);

for (const [key, value] of Object.entries(NightshadeCore)) {
    app.component(key, value);
}

app.mount('#app');
