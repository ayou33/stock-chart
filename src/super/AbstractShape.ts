/**
 *  AbstractShape.ts of project stock-chart
 *  @date 2022/8/8 14:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Event from '../base/Event'
import IInjectable, { InjectHandler, injectTypes, InjectTypes } from '../interface/IInjectable'

abstract class AbstractShape<E extends string> extends Event<E> implements IInjectable {
  private _bounding: { left: number, top: number } | null = null

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

  abstract getElement (): HTMLElement

  protected buildRect (el?: HTMLElement) {
    const element = el ?? this.getElement()
    const rect = element.getBoundingClientRect()

    return this._bounding = {
      left: rect.left + element.clientLeft,
      top: rect.top + element.clientTop,
    }
  }

  pointer (clientX: number, clientY: number, el?: HTMLElement): Vector {
    if (el) {
      const bounding = this.buildRect(el)
      return [clientX - bounding.left, clientY - bounding.top]
    }

    if (!this._bounding) {
      this.buildRect()
    }

    if (this._bounding) {
      return [clientX - this._bounding.left, clientY - this._bounding.top]
    }

    return [clientX, clientY]
  }

  abstract applyInject (name: InjectTypes, type: 'before' | 'after'): this

  injectBefore (name: InjectTypes, handler: InjectHandler): this {
    this.beforeInjections[name].push(handler)

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

}

export default AbstractShape
