<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled, 'header--open': menuOpen }">
    <!-- Gold badge stripe at very top -->
    <div class="header__stripe">
      <span class="header__stripe-text">LOS SANTOS COUNTY — ESTABLISHED 1992</span>
      <span class="header__stripe-divider">★</span>
      <span class="header__stripe-text">PROTECT &amp; SERVE</span>
    </div>

    <div class="container">
      <!-- Logo -->
      <router-link to="/" class="logo" @click="menuOpen = false">
        <div class="logo__badge-wrap">
          <img src="/src/assets/lssd-logo.png" alt="LSSD Badge" class="logo__img" />
          <div class="logo__glow"></div>
        </div>
        <div class="logo__text">
          <span class="logo__county">LOS SANTOS COUNTY</span>
          <span class="logo__dept">SHERIFF'S DEPARTMENT</span>
          <span class="logo__motto">Lex et Ordo</span>
        </div>
      </router-link>

      <!-- Desktop Nav -->
      <!-- Desktop Nav -->
<nav class="nav" aria-label="Main navigation">
  <router-link to="/" class="nav__link" exact-active-class="nav__link--active">
    <span class="nav__link-inner">Главная</span>
  </router-link>
  
  <!-- Отделы - скролл -->
  <button 
    class="nav__link nav__link--button" 
    @click="scrollToDepts()"
  >
    <span class="nav__link-inner">Отделы</span>
  </button>
  
  <router-link to="/public-registry" class="nav__link" active-class="nav__link--active">
    <span class="nav__link-inner">Реестр Пропусков</span>
  </router-link>
  
  <!-- Админ панель - только для лидера -->
  <router-link 
    v-if="isLeader" 
    to="/admin" 
    class="nav__link" 
    active-class="nav__link--active"
  >
    <span class="nav__link-inner">Админ панель</span>
  </router-link>
  
  <!-- Устав - внешняя ссылка -->
  <a 
    href="https://forum.majestic-rp.ru/threads/ustav-los-santos-county-sheriffs-department.2981524/"
    target="_blank"
    rel="noopener noreferrer"
    class="nav__link"
  >
    <span class="nav__link-inner">Устав</span>
  </a>

  <!-- Кнопка Восстановление с выпадающим меню -->
  <div class="nav__dropdown">
    <button class="nav__link nav__link--dropdown">
      <span class="nav__link-inner">Восстановление</span>
      <svg class="nav__dropdown-icon" width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="nav__dropdown-menu">
      <a 
        href="https://clck.ru/3S6bwZ"
        target="_blank"
        rel="noopener noreferrer"
        class="nav__dropdown-item"
      >
        <span class="nav__dropdown-icon">🔧</span>
        <div class="nav__dropdown-content">
          <span class="nav__dropdown-title">IC Восстановление</span>
        </div>
      </a>
      <a 
        href="https://clck.ru/3S6crV"
        target="_blank"
        rel="noopener noreferrer"
        class="nav__dropdown-item"
      >
        <span class="nav__dropdown-icon">⚠️</span>
        <div class="nav__dropdown-content">
          <span class="nav__dropdown-title">ООС Восстановление</span>
          <span class="nav__dropdown-desc">Восстановление после Warn/Ban</span>
        </div>
      </a>
    </div>
  </div>

  <div class="nav__divider"></div>

  <!-- Показываем Вход или Выйти в зависимости от авторизации -->
  <template v-if="!isAuthenticated">
    <router-link to="/login" class="nav__login">
      <span class="nav__login-icon">⬡</span>
      <span>Вход</span>
    </router-link>
  </template>
  <template v-else>
    <button @click="handleLogout" class="nav__logout">
      <span>Выйти</span>
    </button>
  </template>
</nav>

      <!-- Mobile Hamburger -->
      <button class="hamburger" :class="{ 'hamburger--active': menuOpen }" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
        <span class="hamburger__bar"></span>
        <span class="hamburger__bar"></span>
        <span class="hamburger__bar"></span>
      </button>
    </div>

    <!-- Mobile Nav Drawer -->
    <!-- Mobile Nav Drawer -->
<Transition name="drawer">
  <nav v-if="menuOpen" class="drawer" aria-label="Mobile navigation">
    <router-link to="/" class="drawer__link" @click="menuOpen = false">Главная</router-link>
    
    <!-- Отделы - скролл -->
    <button 
      class="drawer__link drawer__link--button" 
      @click="scrollToDepts(); menuOpen = false"
    >
      Отделы
    </button>
    
    <router-link to="/public-registry" class="drawer__link" @click="menuOpen = false">Реестр Пропусков</router-link>
    
    <!-- Админ панель - только для лидера -->
    <router-link 
      v-if="isLeader" 
      to="/admin" 
      class="drawer__link" 
      @click="menuOpen = false"
    >
      Админ панель
    </router-link>
    
    <!-- Устав - внешняя ссылка -->
    <a 
      href="https://forum.majestic-rp.ru/threads/ustav-los-santos-county-sheriffs-department.2677666/"
      target="_blank"
      rel="noopener noreferrer"
      class="drawer__link"
      @click="menuOpen = false"
    >
      Устав
    </a>

    <!-- Восстановление в мобильном меню (аккордеон) -->
    <div class="drawer__accordion">
      <button class="drawer__accordion-btn" @click="toggleRestoreMenu">
        <span>Восстановление</span>
        <svg class="drawer__accordion-icon" :class="{ 'drawer__accordion-icon--open': restoreMenuOpen }" width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <Transition name="accordion">
        <div v-if="restoreMenuOpen" class="drawer__accordion-content">
          <a 
            href="https://clck.ru/3S6bwZ"
            target="_blank"
            rel="noopener noreferrer"
            class="drawer__accordion-item"
            @click="menuOpen = false"
          >
            <span class="drawer__accordion-icon-item">🔧</span>
            <div>
              <div class="drawer__accordion-title">IC Восстановление</div>
              <div class="drawer__accordion-desc">Восстановление имущества, денег и техники</div>
            </div>
          </a>
          <a 
            href="https://clck.ru/3S6crV"
            target="_blank"
            rel="noopener noreferrer"
            class="drawer__accordion-item"
            @click="menuOpen = false"
          >
            <span class="drawer__accordion-icon-item">⚠️</span>
            <div>
              <div class="drawer__accordion-title">WARN/BAN восстановление</div>
              <div class="drawer__accordion-desc">Обжалование и снятие наказаний</div>
            </div>
          </a>
        </div>
      </Transition>
    </div>
    
    <router-link to="/employment" class="drawer__link" @click="menuOpen = false">Трудоустройство</router-link>
    
    <!-- Показываем Вход или Выйти в зависимости от авторизации -->
    <template v-if="!isAuthenticated">
      <router-link to="/login" class="drawer__link drawer__link--login" @click="menuOpen = false">Вход</router-link>
    </template>
    <template v-else>
      <button @click="handleLogout" class="drawer__link drawer__link--logout">
        Выйти
      </button>
    </template>
  </nav>
</Transition>

    <!-- Scanline overlay -->
    <div class="header__scanlines" aria-hidden="true"></div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isScrolled = ref(false)
const menuOpen = ref(false)
const isAuthenticated = ref(false)
const isLeader = ref(false)
const restoreMenuOpen = ref(false)  // <--- ДОБАВЬТЕ ЭТУ СТРОКУ

const scrollToDepts = () => {
  const deptsSection = document.getElementById('departments')
  if (deptsSection) {
    deptsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  menuOpen.value = false
}

const handleNavClick = (e, type) => {
  if (type === 'scroll') {
    e.preventDefault()
    scrollToDepts()
    menuOpen.value = false
  }
}

const toggleRestoreMenu = () => {   // <--- ДОБАВЬТЕ ЭТУ ФУНКЦИЮ
  restoreMenuOpen.value = !restoreMenuOpen.value
}

const checkAuth = () => {
  const auth = localStorage.getItem('lssd_auth')
  if (auth) {
    const user = JSON.parse(auth)
    isAuthenticated.value = true
    isLeader.value = user.isLeader || false
  } else {
    isAuthenticated.value = false
    isLeader.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('lssd_auth')
  isAuthenticated.value = false
  isLeader.value = false
  menuOpen.value = false
  router.push('/')
}

const onScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  checkAuth()
  window.addEventListener('storage', checkAuth)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('storage', checkAuth)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=IM+Fell+English:ital@1&display=swap');

/* ─── CSS Variables ──────────────────────────────── */
.header {
  --gold:        #c6a756;
  --gold-light:  #f0cc7a;
  --gold-dim:    #8b7340;
  --navy:        #080f16;
  --navy-mid:    #0e1a24;
  --navy-light:  #152130;
  --white:       #f0ede8;
  --muted:       rgba(240,237,232,0.55);

  font-family: 'Rajdhani', sans-serif;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background-color: var(--navy);
  transition: background-color 0.4s ease, box-shadow 0.4s ease;

  /* Subtle diagonal weave */
  background-image:
    repeating-linear-gradient(
      -45deg,
      rgba(255,255,255,0.018) 0px,
      rgba(255,255,255,0.018) 1px,
      transparent 1px,
      transparent 6px
    );
}

.header--scrolled {
  background-color: rgba(8, 15, 22, 0.97);
  box-shadow:
    0 1px 0 rgba(198,167,86,0.4),
    0 6px 40px rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
}

/* ─── Gold Stripe ─────────────────────────────────── */
.header__stripe {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  background: linear-gradient(90deg, var(--gold-dim), var(--gold), var(--gold-dim));
  padding: 4px 0;
  letter-spacing: 2.5px;
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--navy);
  text-transform: uppercase;
}

.header__stripe-divider {
  font-size: 0.55rem;
  opacity: 0.7;
}

/* ─── Scanlines ───────────────────────────────────── */
.header__scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    180deg,
    transparent 0px,
    transparent 3px,
    rgba(0,0,0,0.06) 3px,
    rgba(0,0,0,0.06) 4px
  );
  z-index: 0;
}

/* ─── Container ───────────────────────────────────── */
.container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88px;
}

/* ─── Logo ────────────────────────────────────────── */
.logo {
  display: flex;
  align-items: center;
  gap: 18px;
  text-decoration: none;
}

.logo__badge-wrap {
  position: relative;
  flex-shrink: 0;
}

.logo__img {
  height: 66px;
  filter: drop-shadow(0 0 8px rgba(198,167,86,0.3));
  transition: filter 0.3s ease, transform 0.3s ease;
}

.logo:hover .logo__img {
  filter: drop-shadow(0 0 16px rgba(198,167,86,0.6));
  transform: scale(1.04);
}

.logo__glow {
  position: absolute;
  inset: -4px;
  background: radial-gradient(circle, rgba(198,167,86,0.12) 0%, transparent 70%);
  pointer-events: none;
}

.logo__text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.logo__county {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.45rem;
  letter-spacing: 3px;
  color: var(--gold);
  line-height: 1;
}

.logo__dept {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.05rem;
  letter-spacing: 2.5px;
  color: var(--white);
  line-height: 1;
}

.logo__motto {
  font-family: 'IM Fell English', serif;
  font-style: italic;
  font-size: 0.72rem;
  color: var(--gold-dim);
  letter-spacing: 1px;
  margin-top: 3px;
}

/* ─── Nav ─────────────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: var(--muted);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: 2px;
  transition: color 0.2s ease;
  overflow: hidden;
}

.nav__link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(198,167,86,0.07);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
  border-radius: 2px;
}

.nav__link:hover::before,
.nav__link--active::before {
  transform: scaleX(1);
}

.nav__link:hover {
  color: var(--white);
}

.nav__link--active {
  color: var(--gold);
}

/* Gold underline on active */
.nav__link--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 14px;
  right: 14px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  border-radius: 1px;
}

.nav__link-inner {
  position: relative;
  z-index: 1;
}

/* Divider */
.nav__divider {
  width: 1px;
  height: 24px;
  background: linear-gradient(180deg, transparent, var(--gold-dim), transparent);
  margin: 0 10px;
}

/* Login CTA */
.nav__login {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  background: linear-gradient(135deg, var(--gold), #a8883e);
  color: var(--navy);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 9px 20px;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 0 0 1px rgba(198,167,86,0.5), 0 4px 16px rgba(198,167,86,0.2);
}

.nav__login::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  transition: left 0.4s ease;
}

.nav__login:hover::before {
  left: 100%;
}

.nav__login:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 0 1px var(--gold), 0 6px 24px rgba(198,167,86,0.35);
}

.nav__login-icon {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* Logout Button */
.nav__logout {
  background: none;
  border: 1px solid rgba(224, 79, 79, 0.3);
  color: #e04f4f;
  padding: 9px 20px;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: all 0.2s ease;
  margin-left: 10px;
}

.nav__logout:hover {
  border-color: #e04f4f;
  background: rgba(224, 79, 79, 0.1);
  transform: translateY(-1px);
}

/* ─── Hamburger ───────────────────────────────────── */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 10;
}

.hamburger__bar {
  display: block;
  width: 26px;
  height: 2px;
  background: var(--gold);
  border-radius: 1px;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center;
}

.hamburger--active .hamburger__bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger--active .hamburger__bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger--active .hamburger__bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ─── Mobile Drawer ───────────────────────────────── */
.drawer {
  display: flex;
  flex-direction: column;
  background: var(--navy-light);
  border-top: 1px solid rgba(198,167,86,0.25);
  padding: 12px 20px 20px;
  gap: 2px;
}

.drawer__link {
  display: block;
  text-decoration: none;
  color: var(--muted);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 12px 16px;
  border-radius: 2px;
  border-left: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.drawer__link:hover,
.drawer__link.router-link-active {
  color: var(--gold);
  border-left-color: var(--gold);
  background: rgba(198,167,86,0.07);
}

.drawer__link--login {
  margin-top: 10px;
  background: linear-gradient(135deg, var(--gold), #a8883e);
  color: var(--navy);
  border-left-color: transparent !important;
  text-align: center;
  font-weight: 700;
}

.drawer__link--login:hover {
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  color: var(--navy);
}

.drawer__link--logout {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #e04f4f;
  padding: 12px 16px;
  border-left: 2px solid transparent;
  transition: all 0.2s;
  margin-top: 10px;
}

/* ─── Dropdown Menu Styles ──────────────────────── */
.nav__dropdown {
  position: relative;
  display: inline-block;
}

.nav__link--dropdown {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--muted);
  transition: color 0.2s ease;
  padding: 8px 14px;
}

.nav__link--dropdown:hover {
  color: var(--white);
}

.nav__dropdown-icon {
  transition: transform 0.2s ease;
}

.nav__dropdown:hover .nav__dropdown-icon {
  transform: rotate(360deg);
}

.nav__dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 280px;
  background: var(--navy-light);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  padding: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  z-index: 100;
}

.nav__dropdown:hover .nav__dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav__dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  text-decoration: none;
  color: var(--white);
  border-radius: 4px;
  transition: background 0.2s ease;
  border-bottom: 1px solid rgba(198,167,86,0.1);
}

.nav__dropdown-item:last-child {
  border-bottom: none;
}

.nav__dropdown-item:hover {
  background: rgba(198,167,86,0.1);
}

.nav__dropdown-icon {
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
}

.nav__dropdown-content {
  flex: 1;
}

.nav__dropdown-title {
  display: block;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--gold);
  margin-bottom: 2px;
}

.nav__dropdown-desc {
  display: block;
  font-size: 0.7rem;
  color: var(--muted);
  line-height: 1.3;
}

/* ─── Mobile Accordion Styles ───────────────────── */
.drawer__accordion {
  margin: 4px 0;
}

.drawer__accordion-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: none;
  border: none;
  color: var(--muted);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s;
  border-left: 2px solid transparent;
}

.drawer__accordion-btn:hover {
  color: var(--gold);
  border-left-color: var(--gold);
  background: rgba(198,167,86,0.07);
}

.drawer__accordion-icon {
  transition: transform 0.2s ease;
}

.drawer__accordion-icon--open {
  transform: rotate(180deg);
}

.drawer__accordion-content {
  padding: 4px 0 4px 16px;
}

.drawer__accordion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: var(--white);
  border-left: 2px solid transparent;
  transition: background 0.2s, border-color 0.2s;
  margin-left: 16px;
}

.drawer__accordion-item:hover {
  background: rgba(198,167,86,0.07);
  border-left-color: var(--gold);
}

.drawer__accordion-icon-item {
  font-size: 1.1rem;
  min-width: 24px;
}

.drawer__accordion-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--gold);
}

.drawer__accordion-desc {
  font-size: 0.75rem;
  color: var(--muted);
  line-height: 1.3;
}

/* Accordion transition */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
  max-height: 200px;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.drawer__link--logout:hover {
  color: #e04f4f;
  border-left-color: #e04f4f;
  background: rgba(224, 79, 79, 0.1);
}

/* ─── Drawer Transition ───────────────────────────── */
.drawer-enter-active,
.drawer-leave-active {
  transition: max-height 0.35s ease, opacity 0.25s ease;
  max-height: 400px;
  overflow: hidden;
}

.drawer-enter-from,
.drawer-leave-to {
  max-height: 0;
  opacity: 0;
}

/* ─── Nav Button Styles ─────────────────────────── */
.nav__link--button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--muted);
  transition: color 0.2s ease;
}

.nav__link--button:hover {
  color: var(--white);
}

/* ─── Drawer Button Styles ──────────────────────── */
.drawer__link--button {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.drawer__link--button:hover {
  color: var(--gold);
  border-left-color: var(--gold);
  background: rgba(198,167,86,0.07);
}

/* Focus states for accessibility */
.nav__link--button:focus-visible,
.drawer__link--button:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

/* ─── Responsive ──────────────────────────────────── */
@media (max-width: 900px) {
  .nav { display: none; }
  .hamburger { display: flex; }
  .container { height: 76px; padding: 0 24px; }
  .logo__img { height: 52px; }
  .logo__county { font-size: 1.15rem; }
  .logo__dept { font-size: 0.85rem; }
  .logo__motto { display: none; }
}

@media (max-width: 480px) {
  .header__stripe { display: none; }
  .logo__text { display: none; }
  .logo__img { height: 48px; }
}
</style>
