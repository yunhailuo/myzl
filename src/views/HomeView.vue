<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { GAMES_REGISTRY } from '../data/games'
</script>

<template>
  <main class="home">
    <h1>MYZL</h1>
    <div class="games-list">
      <RouterLink v-for="game in GAMES_REGISTRY" :key="game.path" :to="game.path" class="game-link">
        <span v-if="game.icon" class="game-icon">{{ game.icon }}</span>
        <span class="game-title">{{ game.title }}</span>
        <span v-if="game.description" class="game-description">{{ game.description }}</span>
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1.2rem;
  background: #f0f0f0;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.game-link:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.game-title {
  font-weight: 600;
  flex: 1;
  text-align: left;
}

.game-description {
  font-size: 0.9rem;
  color: #666;
  flex-shrink: 0;
}
</style>
