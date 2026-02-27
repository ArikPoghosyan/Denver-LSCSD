import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // <- добавляем импорт роутера
import './assets/main.css'     // <- импорт стилей (если есть)

const app = createApp(App)

app.use(router)  // <- подключаем роутер к приложению

app.mount('#app')