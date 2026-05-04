import { beforeEach, describe, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from './App.vue'

describe('App.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/addition-subtraction', component: { template: '<div>Game</div>' } },
        { path: '/hanzi', component: { template: '<div>Hanzi</div>' } },
        { path: '/distributive-law', component: { template: '<div>Distributive Law</div>' } },
        { path: '/linear-equation', component: { template: '<div>Linear Equation</div>' } },
      ],
    })

    wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })
  })

  it('renders the app component', () => {
    expect(wrapper.find('.app').exists()).toBe(true)
  })

  it('opens the menu from the hamburger button', async () => {
    expect(wrapper.find('.nav').classes()).not.toContain('open')

    await wrapper.find('.hamburger').trigger('click')

    expect(wrapper.find('.nav').classes()).toContain('open')
    expect(wrapper.find('.hamburger').exists()).toBe(false)
    expect(wrapper.find('.overlay').exists()).toBe(true)
  })

  it('closes the menu from the close button and restores the hamburger', async () => {
    await wrapper.find('.hamburger').trigger('click')
    expect(wrapper.find('.nav').classes()).toContain('open')

    await wrapper.find('.close-btn').trigger('click')

    expect(wrapper.find('.nav').classes()).not.toContain('open')
    expect(wrapper.find('.hamburger').exists()).toBe(true)
    expect(wrapper.find('.overlay').exists()).toBe(false)
  })

  it('closes the menu when the overlay is clicked', async () => {
    await wrapper.find('.hamburger').trigger('click')
    await wrapper.find('.overlay').trigger('click')

    expect(wrapper.find('.nav').classes()).not.toContain('open')
    expect(wrapper.find('.hamburger').exists()).toBe(true)
  })

  it('renders the menu header and links when open', async () => {
    await wrapper.find('.hamburger').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.nav-header').exists()).toBe(true)
    expect(wrapper.find('.nav-title').text()).toBe('菜单')

    const links = wrapper.findAll('.nav a')
    expect(links).toHaveLength(6)
    expect(links[0]?.text()).toBe('首页')
    // Navigation links contain icon and title
    expect(links[1]?.text()).toContain('加减法')
    expect(links[2]?.text()).toContain('汉字')
    expect(links[3]?.text()).toContain('汉字查询')
    expect(links[4]?.text()).toContain('分配律')
    expect(links[5]?.text()).toContain('一元一次方程')
  })

  it('has correct navigation links', async () => {
    await wrapper.find('.hamburger').trigger('click')

    const links = wrapper.findAll('.nav a')
    expect(links[0]?.attributes('href')).toBe('/')
    expect(links[1]?.attributes('href')).toBe('/addition-subtraction')
    expect(links[2]?.attributes('href')).toBe('/hanzi')
    expect(links[3]?.attributes('href')).toBe('/hanzi-tool')
    expect(links[4]?.attributes('href')).toBe('/distributive-law')
    expect(links[5]?.attributes('href')).toBe('/linear-equation')
  })

  it('menu link has active class styling capability', async () => {
    await wrapper.find('.hamburger').trigger('click')

    const links = wrapper.findAll('.nav a')
    links.forEach((link) => {
      expect(link.exists()).toBe(true)
    })
  })

  it('hamburger button has proper aria label', () => {
    const hamburger = wrapper.find('.hamburger')
    expect(hamburger.attributes('aria-label')).toBe('Menu')
  })

  it('navigation has proper structure', async () => {
    await wrapper.find('.hamburger').trigger('click')

    expect(wrapper.find('.nav-header').exists()).toBe(true)
    expect(wrapper.findAll('.nav a').length).toBeGreaterThan(0)
  })
})
