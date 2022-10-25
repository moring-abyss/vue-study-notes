import {
  isObject,
} from '@vue/shared'

export const reactiveMap = new WeakMap()
export const shallowReactiveMap = new WeakMap()
export const readonlyMap = new WeakMap()
export const shallowReadonlyMap = new WeakMap()

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive", // 是否响应对象
  // 原始对象
  RAW = "__v_raw",
  SKIP = "__v_skip", // 标记无需响应
  IS_READONLY = "__v_isReadonly", // 是否只读
  // 是否浅反应对象，即除了根属性外不会动态响应例如a.b可以监听到b的改变,a.b.c不会监听到c的改变
  IS_SHALLOW = "__v_isShallow",
}

export function isReactive(value: any): boolean {
  if (isReadonly(value)) {
    return isReactive(value[ReactiveFlags.RAW])
  }
  return !!(value && value[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(value: any): boolean {
  return !!(value && value[ReactiveFlags.IS_READONLY])
}

export function isShallow(value: any): boolean {
  return !!(value && value[ReactiveFlags.IS_SHALLOW])
}

function createReactiveObject(target: any, readonly: boolean, handler: any, proxyMap: WeakMap<any, any>): any {
  if(!isObject(target)) {
    return target
  }

  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(target, handler);
  proxyMap.set(target, proxy);
  return proxy;
}


const get =  createGetter()
const shallowGet =  createGetter(false, true)
const readonlyGet =  createGetter(true)
const shallowReadonlyGet =  createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target: any, key: any, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) {
      return shallow
    }
    const res = Reflect.get(target, key, receiver)
    
    if (shallow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

const set =  createSetter()
const shallowSet =  createSetter(true)

function createSetter(shallow = false) {
  return function set(
    target: object,
    key: string,
    newValue: unknown,
    receiver: object
  ): boolean {
    const result = Reflect.set(target, key, newValue, receiver)
    return result
  }
}

function deleteProperty(target: object, key: any): boolean {
  const result = Reflect.deleteProperty(target, key)
  return result
}

function has(target: object, key: any): boolean {
  const result = Reflect.has(target, key)
  return result
}

function ownKeys(target: object): (any)[] {
  return Reflect.ownKeys(target)
}

const baseHandler = { 
  get: get,
  set: set,
  has: has,
  ownKeys: ownKeys,
  deleteProperty: deleteProperty,
}

const readonlyHandler = { 
  get: readonlyGet,
}

const shallowHandler = { 
  get: shallowGet,
  set: shallowSet,
  has: has,
  ownKeys: ownKeys,
  deleteProperty: deleteProperty,
}

const shallowReadonlyHandler = { 
  get: shallowReadonlyGet,
}

export function reactive(target: any) {
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(target, false, baseHandler, reactiveMap)
}

export function readonly(target: any) {
  return createReactiveObject(target, true, readonlyHandler, readonlyMap)
}

export function shallowReactive(target: any) {
  return createReactiveObject(target, false, shallowHandler, shallowReactiveMap)
}

export function shallowReadonly(target: any) {
  return createReactiveObject(target, true, shallowReadonlyHandler, shallowReadonlyMap)
}