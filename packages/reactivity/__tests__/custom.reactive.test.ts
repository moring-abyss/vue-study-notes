import { reactive, isReactive } from '../src/reactive'

describe('reactivity/reactive', () => {
  test('Object', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    // get
    expect(observed.foo).toBe(1)
    // has
    expect('foo' in observed).toBe(true)
    // ownKeys
    expect(Object.keys(observed)).toEqual(['foo'])
    // deleteProperty
    delete observed.foo
    expect('foo' in observed).toBe(false)
  })
  
  test('array', () => {
    const original = [1, 2, 3]
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    // get
    expect(observed[2]).toBe(3)
    // has
    expect(1 in observed).toBe(true)
    // ownKeys
    expect(Object.keys(observed)).toEqual(['0', '1', '2'])
    // set
    observed[3] = 4
    expect(original[3]).toBe(4)
    // deleteProperty
    delete observed[3]
    expect(original[3]).toBe(undefined)
  })
})