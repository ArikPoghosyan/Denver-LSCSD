import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistryView from '../views/RegistryView.vue'  // Измененный импорт
import LoginView from '../views/Login.vue'
import AdminView from '../views/Admin.vue'
import PublicRegistryView from '../views/PublicRegistry.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/registry',
      name: 'registry',
      component: RegistryView,
      meta: { requiresAuth: true }  // Только для авторизованных
    },
    {
      path: '/public-registry',  // Публичный доступ
      name: 'public-registry',
      component: PublicRegistryView  // Доступен всем
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresLeader: true }
    }
  ]
})

// Глобальная защита роутов
router.beforeEach((to, from, next) => {
  const auth = localStorage.getItem('lssd_auth')
  const user = auth ? JSON.parse(auth) : null

  // Публичный реестр доступен всем - пропускаем без проверки
  if (to.path === '/public-registry') {
    next()
    return
  }

  // Если пользователь уже авторизован и пытается зайти на логин - редирект
  if (to.path === '/login' && user) {
    if (user.isLeader) {
      next('/admin')
    } else {
      next('/registry')
    }
    return
  }

  // Проверка для админ-панели (только лидер)
  if (to.meta.requiresLeader) {
    if (user && user.isLeader) {
      next()
    } else {
      next('/login')
    }
  }
  
  // Проверка для реестра (любая авторизация)
  else if (to.meta.requiresAuth) {
    if (user) {
      next()
    } else {
      next('/login')
    }
  }
  
  else {
    next()
  }
})

export default router