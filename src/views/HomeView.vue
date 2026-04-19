<script setup lang="ts">
import { RouterLink } from 'vue-router'

const games = [
  { name: 'Addition and Subtraction within 20', route: '/addition-subtraction' }
]
</script>

<template>
  <main class="home">
    <h1>Educational Games</h1>
    <div class="games-list">
      <RouterLink v-for="game in games" :key="game.route" :to="game.route" class="game-link">
        {{ game.name }}
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.game-link {
  display: block;
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: background 0.2s;
}

.game-link:hover {
  background: #e0e0e0;
}
</style>
