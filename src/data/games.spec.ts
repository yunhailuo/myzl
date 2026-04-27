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
    it('should generate routes for all games', () => {
      const routes = generateRoutes()

      expect(routes).toHaveLength(GAMES_REGISTRY.length)
    })

    it('should generate routes with correct structure', () => {
      const routes = generateRoutes()

      routes.forEach((route, index) => {
        const game = GAMES_REGISTRY[index]
        expect(route.path).toBe(game?.path)
        expect(route.name).toBe(game?.name)
        expect(route.meta?.title).toBe(game?.title)
        expect(route.component).toBeDefined()
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
