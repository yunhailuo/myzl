<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>

<template>
  <div class="app">
    <button @click="toggleMenu" class="hamburger fixed-hamburger" :class="{ open: menuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="nav" :class="{ open: menuOpen }">
      <RouterLink to="/" @click="menuOpen = false">首页</RouterLink>
      <RouterLink to="/addition-subtraction" @click="menuOpen = false">加减法</RouterLink>
    </nav>

    <div v-if="menuOpen" class="overlay" @click="menuOpen = false"></div>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.main {
  flex: 1;
  width: 100vw;
  max-width: 100vw;
  padding: 0;
  margin: 0;
}
.header {
  display: none;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 1rem;
}

.hamburger span {
  width: 40px;
  height: 4px;
  background: #333;
  transition: all 0.3s;
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(7px, 7px);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(9px, -9px);
}

.fixed-hamburger {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;
}

.nav {
  position: fixed;
  top: 0;
  left: -250px;
  height: 100vh;
  width: 250px;
  background: #f8f9fa;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  transition: left 0.3s ease;
  z-index: 1000;
  padding-top: 60px;
}

.nav.open {
  left: 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.nav a {
  padding: 1rem;
  text-decoration: none;
  color: #333;
  border-bottom: 1px solid #eee;
}

.nav a:last-child {
  border-bottom: none;
}

.nav a:hover {
  background: #e9ecef;
}

.main {
  flex: 1;
  padding: 0;
}
</style>
