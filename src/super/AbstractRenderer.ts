/**
 *  AbstractRender.ts of project stock-chart
 *  @date 2022/8/19 14:45
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Event from '../base/Event'
import { UpdateLevel, UpdatePayload } from '../core/DataSource'
import { InjectHandler, injectTypes, InjectTypes } from '../interface/IInjectable'
import IRenderer from '../interface/IRenderer'

abstract class AbstractRenderer<E extends string = never> extends Event<E> implements IRenderer<E> {
  lastUpdate: UpdatePayload | null = null

  protected readonly beforeInjections: Record<InjectTypes, InjectHandler[]> = {
    update: [],
    draw: [],
    resize: [],
  }

  protected readonly afterInjections: Record<InjectTypes, InjectHandler[]> = {
    update: [],
    draw: [],
    resize: [],
  }

  injectBefore (name: InjectTypes, handler: InjectHandler): this {
    this.beforeInjections[name].unshift(handler)

    return this
  }

  injectAfter (name: InjectTypes, handler: InjectHandler): this {
    this.afterInjections[name].push(handler)

    return this
  }

  ejectBefore (name: InjectTypes, handler?: InjectHandler | undefined): this {
    if (handler) {
      this.beforeInjections[name] = this.beforeInjections[name].filter(h => h === handler)
    } else {
      this.beforeInjections[name] = []
    }
    return this
  }

  ejectAfter (name: InjectTypes, handler?: InjectHandler | undefined): this {
    if (handler) {
      this.afterInjections[name] = this.afterInjections[name].filter(h => h === handler)
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

  apply (update?: UpdatePayload | null): this {
    this.applyInject('update', 'before')

    if (update) {
      this.lastUpdate = update
    } else if (this.lastUpdate && this.lastUpdate.level !== UpdateLevel.REDRAW) {
      this.lastUpdate.lastChange = { ...this.lastUpdate }
      this.lastUpdate.level = UpdateLevel.REDRAW
    }

    if (this.lastUpdate) {
      this.applyInject('draw', 'before')
      this.draw(this.lastUpdate)
      this.applyInject('draw', 'after')
    }

    this.applyInject('update', 'after')

    return this
  }

  destroy (): this {
    this.off('*')
    this.ejectAll('*')

    return this
  }

  abstract draw (update: UpdatePayload): this;

  abstract applyInject (name: InjectTypes, type: 'before' | 'after'): this

  resize (): this {
    this.apply()

    return this
  }
}

export default AbstractRenderer
