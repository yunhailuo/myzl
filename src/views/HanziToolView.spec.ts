import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HanziToolView from './HanziToolView.vue'

describe('HanziToolView', () => {
  it('renders the tool title', () => {
    const wrapper = mount(HanziToolView)
    expect(wrapper.text()).toContain('汉字查询')
  })

  it('shows empty state initially', () => {
    const wrapper = mount(HanziToolView)
    expect(wrapper.text()).toContain('输入汉字查看拼音、笔顺和例词')
  })

  it('accepts single Chinese character input', async () => {
    const wrapper = mount(HanziToolView)
    const input = wrapper.find('.char-input')
    
    await input.setValue('你')
    await wrapper.vm.$nextTick()
    
    expect((wrapper.find('.char-input').element as HTMLInputElement).value).toBe('你')
  })

  it('shows error for non-Chinese character', async () => {
    const wrapper = mount(HanziToolView)
    const input = wrapper.find('.char-input')
    
    await input.setValue('a')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('请输入有效的单个汉字')
  })

  it('clears input when clear button is clicked', async () => {
    const wrapper = mount(HanziToolView)
    const input = wrapper.find('.char-input')
    
    await input.setValue('你')
    await wrapper.vm.$nextTick()
    
    const clearBtn = wrapper.find('.clear-btn')
    await clearBtn.trigger('click')
    await wrapper.vm.$nextTick()
    
    expect((wrapper.find('.char-input').element as HTMLInputElement).value).toBe('')
  })

  it('only keeps last character when multiple characters are entered', async () => {
    const wrapper = mount(HanziToolView)
    const input = wrapper.find('.char-input')
    
    // Simulate entering multiple characters
    await input.setValue('你好')
    await wrapper.vm.$nextTick()
    
    // Trigger blur to validate and normalize
    await input.trigger('blur')
    await wrapper.vm.$nextTick()
    
    // Should only keep the last character after validation
    expect((wrapper.find('.char-input').element as HTMLInputElement).value).toBe('好')
  })

  it('shows error for emoji input', async () => {
    const wrapper = mount(HanziToolView)
    const input = wrapper.find('.char-input')
    
    // Simulate entering an emoji (which may be surrogate pairs)
    await input.setValue('📔')
    await wrapper.vm.$nextTick()
    
    // Trigger blur to validate
    await input.trigger('blur')
    await wrapper.vm.$nextTick()
    
    // Should show error state, not results
    expect(wrapper.find('.error-state').exists()).toBe(true)
    expect(wrapper.find('.results').exists()).toBe(false)
  })
})
