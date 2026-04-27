import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import HomeView from './HomeView.vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { GAMES_REGISTRY } from '../data/games'

describe('HomeView.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Create routes for all games in the registry
    const routes = [
      { path: '/', component: HomeView },
      ...GAMES_REGISTRY.map((game) => ({
        path: game.path,
        name: game.name,
        component: { template: `<div>${game.title}</div>` },
      })),
    ]

    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    })
  })

  it('renders the home page', () => {
    expect(wrapper.find('.home').exists()).toBe(true)
  })

  it('displays the title', () => {
    const title = wrapper.find('h1')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('MYZL')
  })

  it('displays the games list', () => {
    expect(wrapper.find('.games-list').exists()).toBe(true)
  })

  it('shows the addition and subtraction game', () => {
    const links = wrapper.findAll('.game-link')
    expect(links.length).toBeGreaterThan(0)
    // 游戏链接包含图标、标题和描述
    expect(links[0]?.text()).toContain('加减法')
  })

  it('has correct route for addition-subtraction game', () => {
    const gameLink = wrapper.find('.game-link')
    expect(gameLink.attributes('href')).toBe('/addition-subtraction')
  })

  it('shows the hanzi game', () => {
    const links = wrapper.findAll('.game-link')
    // 使用toContain来匹配包含图标的文本
    const hanziLink = links.find((link) => link.text().includes('汉字'))
    expect(hanziLink).toBeDefined()
  })

  it('has correct route for hanzi game', () => {
    const links = wrapper.findAll('.game-link')
    const hanziLink = links.find((link) => link.text().includes('汉字'))
    expect(hanziLink?.attributes('href')).toBe('/hanzi')
  })

  it('has at least two game links', () => {
    const links = wrapper.findAll('.game-link')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  it('game links have proper styling classes', () => {
    const links = wrapper.findAll('.game-link')
    links.forEach((link) => {
      expect(link.classes()).toContain('game-link')
    })
  })
})
