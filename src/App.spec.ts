import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import App from './App.vue'
import { createRouter, createMemoryHistory } from 'vue-router'

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

  it('hides hamburger button when menu is open', async () => {
    const hamburger = wrapper.find('.hamburger')
    await hamburger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.hamburger').exists()).toBe(false)
  })

  it('shows hamburger button when menu closes', async () => {
    const hamburger = wrapper.find('.hamburger')
    await hamburger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.hamburger').exists()).toBe(false)
    await hamburger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.hamburger').exists()).toBe(true)
  })

  it('opens menu when hamburger button is clicked', async () => {
    const hamburger = wrapper.find('.hamburger')
    const nav = wrapper.find('.nav')
    expect(nav.classes()).not.toContain('open')
    await hamburger.trigger('click')
    expect(nav.classes()).toContain('open')
  })

  it('closes menu when close button is clicked', async () => {
    const hamburger = wrapper.find('.hamburger')
    const closeBtn = wrapper.find('.close-btn')
    await hamburger.trigger('click')
    expect(wrapper.find('.nav').classes()).toContain('open')
    await closeBtn.trigger('click')
    expect(wrapper.find('.nav').classes()).not.toContain('open')
  })

  it('closes menu when overlay is clicked', async () => {
    const hamburger = wrapper.find('.hamburger')
    await hamburger.trigger('click')
    expect(wrapper.find('.nav').classes()).toContain('open')
    const overlay = wrapper.find('.overlay')
    if (overlay.exists()) {
      await overlay.trigger('click')
    }
    expect(wrapper.find('.nav').classes()).not.toContain('open')
  })

  it('has correct menu header with title and close button', async () => {
    const hamburger = wrapper.find('.hamburger')
    await hamburger.trigger('click')
    const header = wrapper.find('.nav-header')
    expect(header.exists()).toBe(true)
    expect(header.find('.nav-title').text()).toBe('菜单')
    expect(header.find('.close-btn').exists()).toBe(true)
  })

  it('has home link in menu', async () => {
    const hamburger = wrapper.find('.hamburger')
    await hamburger.trigger('click')
    const homeLink = wrapper.find('.nav a')
    expect(homeLink.exists()).toBe(true)
    expect(homeLink.text()).toBe('首页')
  })

  it('has addition-subtraction link in menu', async () => {
    const hamburger = wrapper.find('.hamburger')
    await hamburger.trigger('click')
    const gameLink = wrapper.findAll('.nav a')[1]
    expect(gameLink!.exists()).toBe(true)
    expect(gameLink!.text()).toBe('加减法')
  })
})
