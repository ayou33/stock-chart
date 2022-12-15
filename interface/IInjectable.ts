/**
 *  方法注入抽象
 *  IInjectable.ts of project stock-chart
 *  @date 2022/8/12 14:26
 *  @author 阿佑[ayooooo@petalmail.com]
 */
export const injectTypes = ['update', 'draw', 'resize'] as const

export type InjectTypes = typeof injectTypes[number]

export type InjectPosition = 'before' | 'after'

export type InjectionGroup = {
  [P in InjectTypes]?: InjectHandler[]
}

export type InjectHandler<T extends IInjectable = IInjectable> = (ctx: T) => void

interface IInjectable {
  injectBefore (name: InjectTypes, handler: InjectHandler): this;

  injectAfter (name: InjectTypes, handler: InjectHandler): this;

  applyInject (name: InjectTypes, position: InjectPosition): this;

  ejectBefore (name: InjectTypes, handler?: InjectHandler): this;

  ejectAfter (name: InjectTypes, handler?: InjectHandler): this;

  ejectAll (name: InjectTypes | '*'): this;
}

export default IInjectable
