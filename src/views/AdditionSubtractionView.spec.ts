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
})
