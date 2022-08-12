/**
 *  IInjectable.ts of project stock-chart
 *  @date 2022/8/12 14:26
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'

export const injectTypes = ['update', 'draw', 'resize'] as const

export type InjectTypes = typeof injectTypes[number]

export type InjectPosition = 'before' | 'after'

export type InjectHandler = (
  context: CanvasRenderingContext2D, update: UpdatePayload | null, container: ContainerCell) => void

interface IInjectable {
  injectBefore (name: InjectTypes, handler: InjectHandler): this;

  injectAfter (name: InjectTypes, handler: InjectHandler): this;

  applyInject (name: InjectTypes, position: InjectPosition): this;

  ejectBefore (name: InjectTypes, handler?: InjectHandler): this;

  ejectAfter (name: InjectTypes, handler?: InjectHandler): this;

  ejectAll (name: InjectTypes | '*'): this;
}

export default IInjectable
