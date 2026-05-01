<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { GAMES_REGISTRY } from '@/data/games'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>

<template>
  <div class="app">
    <!-- Hamburger menu button -->
    <button
      v-if="!menuOpen"
      @click="toggleMenu"
      class="hamburger fixed-hamburger"
      :class="{ open: menuOpen }"
      aria-label="Menu"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M3 12h18M3 6h18M3 18h18"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- Navigation menu -->
    <nav class="nav" :class="{ open: menuOpen }">
      <div class="nav-header">
        <span class="nav-title">菜单</span>
        <button class="close-btn" @click="menuOpen = false" aria-label="Close">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <RouterLink to="/" @click="menuOpen = false">首页</RouterLink>
      <RouterLink
        v-for="game in GAMES_REGISTRY"
        :key="game.path"
        :to="game.path"
        @click="menuOpen = false"
      >
        <span v-if="game.icon" class="nav-icon">{{ game.icon }}</span>
        {{ game.title }}
      </RouterLink>
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
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 1rem;
  font-size: 1.5rem;
  line-height: 1;
}

.hamburger svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
}

.hamburger.open svg {
  opacity: 0.5;
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
  z-index: 1002;
}

.nav.open {
  left: 0;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.nav-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.close-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav a:last-child {
  border-bottom: none;
}

.nav a:hover {
  background: #e9ecef;
}

.nav-icon {
  font-size: 1.2rem;
}

.main {
  flex: 1;
  padding: 0;
}

@media print {
  .hamburger,
  .nav,
  .overlay {
    display: none !important;
  }
}
</style>
