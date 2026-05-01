import { describe, it, expect } from 'vitest'
import { GAMES_REGISTRY, getGameByPath, getGameByName, generateRoutes } from './games'

describe('Games Registry', () => {
  describe('GAMES_REGISTRY', () => {
    it('should contain all registered games', () => {
      expect(GAMES_REGISTRY).toHaveLength(4)
    })

    it('should have required fields for each game', () => {
      GAMES_REGISTRY.forEach((game) => {
        expect(game.path).toBeDefined()
        expect(game.name).toBeDefined()
        expect(game.title).toBeDefined()
        expect(game.component).toBeDefined()
      })
    })

    it('should have unique paths', () => {
      const paths = GAMES_REGISTRY.map((game) => game.path)
      const uniquePaths = new Set(paths)
      expect(uniquePaths.size).toBe(paths.length)
    })

    it('should have unique names', () => {
      const names = GAMES_REGISTRY.map((game) => game.name)
      const uniqueNames = new Set(names)
      expect(uniqueNames.size).toBe(names.length)
    })
  })

  describe('getGameByPath', () => {
    it('should find game by valid path', () => {
      const game = getGameByPath('/addition-subtraction')

      expect(game).toBeDefined()
      expect(game?.name).toBe('addition-subtraction')
    })

    it('should return undefined for invalid path', () => {
      const game = getGameByPath('/invalid-path')

      expect(game).toBeUndefined()
    })

    it('should return undefined for empty path', () => {
      const game = getGameByPath('')

      expect(game).toBeUndefined()
    })
  })

  describe('getGameByName', () => {
    it('should find game by valid name', () => {
      const game = getGameByName('hanzi')

      expect(game).toBeDefined()
      expect(game?.title).toBe('汉字')
    })

    it('should return undefined for invalid name', () => {
      const game = getGameByName('invalid-game')

      expect(game).toBeUndefined()
    })
  })

  describe('generateRoutes', () => {
    it('should generate routes for all games (main + conditional batch)', () => {
      const routes = generateRoutes()

      // Count expected routes: each game has main route, plus batch if batchStoreLoader is provided
      const expectedRouteCount = GAMES_REGISTRY.reduce((count, game) => {
        return count + 1 + (game.batchStoreLoader ? 1 : 0)
      }, 0)

      expect(routes).toHaveLength(expectedRouteCount)
    })

    it('should generate main routes for all games', () => {
      const routes = generateRoutes()

      GAMES_REGISTRY.forEach((game) => {
        const mainRoute = routes.find((r) => r.name === game.name)
        expect(mainRoute).toBeDefined()
        expect(mainRoute?.path).toBe(game.path)
        expect(mainRoute?.meta?.title).toBe(game.title)
        expect(mainRoute?.component).toBeDefined()
      })
    })

    it('should generate batch routes for games with batchStoreLoader', () => {
      const routes = generateRoutes()

      // Filter games that have batchStoreLoader
      const gamesWithBatch = GAMES_REGISTRY.filter((game) => game.batchStoreLoader)

      gamesWithBatch.forEach((game) => {
        const batchRoute = routes.find((r) => r.name === `${game.name}-batch`)
        expect(batchRoute).toBeDefined()
        expect(batchRoute?.path).toBe(`${game.path}/batch`)
        expect(batchRoute?.meta?.title).toBe(`${game.title} - 批量生成`)
        expect(batchRoute?.component).toBeDefined()
      })
    })

    it('should not generate batch routes for games without batchStoreLoader', () => {
      const routes = generateRoutes()

      // Filter games that don't have batchStoreLoader
      const gamesWithoutBatch = GAMES_REGISTRY.filter((game) => !game.batchStoreLoader)

      gamesWithoutBatch.forEach((game) => {
        const batchRoute = routes.find((r) => r.name === `${game.name}-batch`)
        expect(batchRoute).toBeUndefined()
      })
    })

    it('should generate lazy-loaded components', () => {
      const routes = generateRoutes()

      routes.forEach((route) => {
        // Component should be a function (dynamic import)
        expect(typeof route.component).toBe('function')
      })
    })

    it('should include all games from registry', () => {
      const routes = generateRoutes()
      const routePaths = routes.map((r) => r.path)

      GAMES_REGISTRY.forEach((game) => {
        expect(routePaths).toContain(game.path)
      })
    })
  })
})
