<template>
  <div>
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
</script>

<style>
/* Глобальные стили */
:root {
  --gold: #c6a756;
  --navy: #080f16;
  --white: #f0ede8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--navy);
  color: var(--white);
  font-family: 'Rajdhani', sans-serif;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
