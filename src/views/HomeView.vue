<script setup lang="ts">
import { RouterLink } from 'vue-router'

const games = [
  { name: '加减法', route: '/addition-subtraction' },
  { name: '汉字', route: '/hanzi' }
]
</script>

<template>
  <main class="home">
    <h1>快问快答</h1>
    <div class="games-list">
      <RouterLink v-for="game in games" :key="game.route" :to="game.route" class="game-link">
        {{ game.name }}
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.home {
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  padding: 4rem 0 0;
  margin: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.home h1 {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  margin: 0;
  padding: 0;
  font-size: 1.8rem;
  line-height: 1.2;
  z-index: 1000;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
}

.game-link {
  display: block;
  width: 100%;
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: background 0.2s;
  font-size: 1.2rem;
}

.game-link:hover {
  background: #e0e0e0;
}
</style>
