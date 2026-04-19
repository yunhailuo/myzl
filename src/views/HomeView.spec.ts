import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import HomeView from './HomeView.vue'
import { createRouter, createMemoryHistory } from 'vue-router'

describe('HomeView.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: HomeView },
        { path: '/addition-subtraction', component: { template: '<div>Game</div>' } },
      ],
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
    expect(title.text()).toBe('快问快答')
  })

  it('displays the games list', () => {
    expect(wrapper.find('.games-list').exists()).toBe(true)
  })

  it('shows the addition and subtraction game', () => {
    const links = wrapper.findAll('.game-link')
    expect(links.length).toBeGreaterThan(0)
    expect(links[0]!.text()).toBe('加减法')
  })

  it('has correct route for game', () => {
    const gameLink = wrapper.find('.game-link')
    expect(gameLink.attributes('href')).toBe('/addition-subtraction')
  })
})
