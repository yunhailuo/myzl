import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CircularProgress from './CircularProgress.vue'

describe('CircularProgress', () => {
  it('binds the progress arc rotation to the circle center', () => {
    const wrapper = mount(CircularProgress, {
      props: { progress: 50, size: 200 },
    })

    expect(wrapper.get('circle.progress').attributes('transform')).toBe('rotate(-90 100 100)')
  })

  it('clamps progress values to the ring range', () => {
    const wrapper = mount(CircularProgress, {
      props: { progress: 150, size: 200 },
    })

    expect(wrapper.get('circle.progress').attributes('stroke-dashoffset')).toBe('0')
    expect(wrapper.get('svg').attributes('aria-valuenow')).toBe('100')
  })

  it('exposes progress semantics to assistive technology', () => {
    const wrapper = mount(CircularProgress, {
      props: { progress: 25, size: 200 },
    })

    expect(wrapper.get('[role="progressbar"]').attributes()).toMatchObject({
      'aria-label': '计时进度',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': '25',
    })
  })
})
