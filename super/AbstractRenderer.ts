/**
 *  Renderer是具有绘制/重绘全周期可注入并提供窗口大小自适应可卸载的支持事件模型的渲染引擎抽象模型
 *  是指标和chart绘制的基础
 *
 *  AbstractRenderer.ts of project stock-chart
 *  @date 2022/8/19 14:45
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Event from '../base/Event'
import { UpdateLevel, UpdatePayload } from '../core/DataSource'
import {
  InjectHandler,
  InjectionGroup,
  InjectPosition,
  injectTypes,
  InjectTypes,
} from '../interface/IInjectable'
import IRenderer from '../interface/IRenderer'

abstract class AbstractRenderer<E extends string = never> extends Event<E> implements IRenderer<E> {
  lastUpdate: UpdatePayload | null = null

  protected readonly beforeInjections: InjectionGroup<IRenderer> = {}
  protected readonly afterInjections: InjectionGroup<IRenderer> = {}

  of (index: number) {
    return this.lastUpdate?.bars[index]
  }

  injectBefore<T extends IRenderer> (name: InjectTypes, handler: InjectHandler<T>): this {
    (this.beforeInjections[name] ??= []).unshift(handler as InjectHandler<IRenderer>)

    return this
  }

  injectAfter<T extends IRenderer> (
    name: InjectTypes,
    handler: InjectHandler<T>,
  ): this {
    (this.afterInjections[name] ??= []).push(handler as InjectHandler<IRenderer>)

    return this
  }

  ejectBefore (name: InjectTypes, handler?: InjectHandler | undefined): this {
    if (handler && this.beforeInjections[name]) {
      this.beforeInjections[name] = this.beforeInjections[name]!.filter(h => h === handler)
    } else {
      this.beforeInjections[name] = []
    }
    return this
  }

  ejectAfter (name: InjectTypes, handler?: InjectHandler | undefined): this {
    if (handler && this.afterInjections[name]) {
      this.afterInjections[name] = this.afterInjections[name]!.filter(h => h === handler)
    } else {
      this.afterInjections[name] = []
    }
    return this
  }

  ejectAll (name: InjectTypes | '*'): this {
    if (name === '*') {
      injectTypes.map(type => {
        this.ejectBefore(type)
        this.ejectAfter(type)
      })
    } else {
      this.ejectBefore(name)
      this.ejectAfter(name)
    }

    return this
  }

  apply (update: UpdatePayload): this {
    this.applyInject('update', 'before')

    /**
     * 不同renderer之间 数据隔离
     */
    this.lastUpdate = { ...update }

    this.applyInject('draw', 'before')

    this.draw(this.lastUpdate)

    this.applyInject('draw', 'after')

    this.applyInject('update', 'after')

    return this
  }

  replay (update?: UpdatePayload | null) {
    const rendered = update ?? this.lastUpdate

    if (rendered) {
      rendered.lastChange = rendered
      rendered.level = UpdateLevel.REPLAY

      this.apply(rendered)
    }

    return this
  }

  destroy (): this {
    this.off('*')
    this.ejectAll('*')

    return this
  }

  abstract draw (update: UpdatePayload): this;

  abstract applyInject (type: InjectTypes, position: InjectPosition): this

  resize (): this {
    this.replay()

    return this
  }
}

export default AbstractRenderer
