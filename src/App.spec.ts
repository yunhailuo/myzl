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

    expect(wrapper.find('.nav-header').exists()).toBe(true)
    expect(wrapper.find('.nav-title').text()).toBe('菜单')

    const links = wrapper.findAll('.nav a')
    expect(links).toHaveLength(2)
    expect(links[0]?.text()).toBe('首页')
    expect(links[1]?.text()).toBe('加减法')
  })
})
