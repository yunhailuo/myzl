import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import AdditionSubtractionView from './AdditionSubtractionView.vue'

describe('AdditionSubtractionView.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(AdditionSubtractionView)
  })

  it('renders the game component', () => {
    expect(wrapper.find('.game').exists()).toBe(true)
  })

  it('displays the counter', () => {
    const counter = wrapper.find('.counter')
    expect(counter.exists()).toBe(true)
    expect(counter.text()).toContain('第 1 题')
  })

  it('displays a question', () => {
    const question = wrapper.find('.question')
    expect(question.exists()).toBe(true)
    expect(question.text()).toMatch(/\d+ [+-] \d+/)
  })

  it('has left and right navigation buttons', () => {
    const buttons = wrapper.findAll('.nav-bar')
    expect(buttons).toHaveLength(2)
  })

  it('left button is disabled on first question', () => {
    const leftBtn = wrapper.find('.nav-bar.left')
    expect(leftBtn.attributes('disabled')).toBeDefined()
  })

  it('right button is not disabled', () => {
    const rightBtn = wrapper.find('.nav-bar.right')
    expect(rightBtn.attributes('disabled')).toBeUndefined()
  })

  it('navigates to next question when right button is clicked', async () => {
    const rightBtn = wrapper.find('.nav-bar.right')
    await rightBtn.trigger('click')
    const counter = wrapper.find('.counter')
    expect(counter.text()).toContain('第 2 题')
  })

  it('navigates to previous question when left button is clicked', async () => {
    const rightBtn = wrapper.find('.nav-bar.right')
    await rightBtn.trigger('click')
    const leftBtn = wrapper.find('.nav-bar.left')
    await leftBtn.trigger('click')
    const counter = wrapper.find('.counter')
    expect(counter.text()).toContain('第 1 题')
  })

  it('toggles config panel when config button is clicked', async () => {
    const configBtn = wrapper.find('.config-btn')
    expect(wrapper.find('.config-panel').classes()).not.toContain('open')
    await configBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.config-panel').classes()).toContain('open')
    expect(wrapper.find('.config-overlay').classes()).toContain('active')
  })

  it('closes config panel when close button is clicked', async () => {
    const configBtn = wrapper.find('.config-btn')
    await configBtn.trigger('click')
    await wrapper.vm.$nextTick()
    const closeBtn = wrapper.find('.close-btn')
    await closeBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.config-panel').classes()).not.toContain('open')
    expect(wrapper.find('.config-overlay').classes()).not.toContain('active')
  })

  it('config panel has correct header with title and close button', async () => {
    const configBtn = wrapper.find('.config-btn')
    await configBtn.trigger('click')
    await wrapper.vm.$nextTick()
    const header = wrapper.find('.config-header')
    expect(header.exists()).toBe(true)
    expect(header.find('.config-title').text()).toBe('设置')
    expect(header.find('.close-btn').exists()).toBe(true)
  })

  it('config panel closes when overlay is clicked', async () => {
    const configBtn = wrapper.find('.config-btn')
    await configBtn.trigger('click')
    await wrapper.vm.$nextTick()
    const overlay = wrapper.find('.config-overlay')
    if (overlay.exists()) {
      await overlay.trigger('click')
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.find('.config-panel').classes()).not.toContain('open')
  })

  it('toggles arrow visibility when checkbox is changed', async () => {
    const arrowCheckbox = wrapper.find('input[type="checkbox"]')
    expect(wrapper.findAll('.nav-bar')).toHaveLength(2)
    await arrowCheckbox.setValue(false)
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.nav-bar')).toHaveLength(0)
    await arrowCheckbox.setValue(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.nav-bar')).toHaveLength(2)
  })

  it('toggles navigation when checkbox is changed', async () => {
    const navCheckbox = wrapper.find('input[type="checkbox"]')
    const questionArea = wrapper.find('.question-area')
    await navCheckbox.setValue(false)
    await wrapper.vm.$nextTick()
    expect(questionArea.attributes('class')).toContain('arrows-disabled')
    await navCheckbox.setValue(true)
    await wrapper.vm.$nextTick()
    expect(questionArea.attributes('class')).not.toContain('arrows-disabled')
  })
})
