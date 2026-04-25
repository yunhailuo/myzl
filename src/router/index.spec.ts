import { describe, it, expect } from 'vitest'
import router from './index'

describe('Router Configuration', () => {
  it('should have home route', () => {
    const routes = router.getRoutes()
    const homeRoute = routes.find((route) => route.path === '/')

    expect(homeRoute).toBeDefined()
    expect(homeRoute?.name).toBe('home')
  })

  it('should have addition-subtraction route', () => {
    const routes = router.getRoutes()
    const gameRoute = routes.find((route) => route.path === '/addition-subtraction')

    expect(gameRoute).toBeDefined()
    expect(gameRoute?.name).toBe('addition-subtraction')
  })

  it('should have hanzi route', () => {
    const routes = router.getRoutes()
    const hanziRoute = routes.find((route) => route.path === '/hanzi')

    expect(hanziRoute).toBeDefined()
    expect(hanziRoute?.name).toBe('hanzi')
  })

  it('should have correct titles for all routes', () => {
    const routes = router.getRoutes()

    const homeRoute = routes.find((route) => route.name === 'home')
    const additionRoute = routes.find((route) => route.name === 'addition-subtraction')
    const hanziRoute = routes.find((route) => route.name === 'hanzi')

    expect(homeRoute?.meta?.title).toBe('首页')
    expect(additionRoute?.meta?.title).toBe('加减法')
    expect(hanziRoute?.meta?.title).toBe('汉字')
  })

  it('should resolve home route correctly', async () => {
    const resolved = router.resolve('/')
    expect(resolved.name).toBe('home')
  })

  it('should resolve addition-subtraction route correctly', async () => {
    const resolved = router.resolve('/addition-subtraction')
    expect(resolved.name).toBe('addition-subtraction')
  })

  it('should resolve hanzi route correctly', async () => {
    const resolved = router.resolve('/hanzi')
    expect(resolved.name).toBe('hanzi')
  })
})
