/**
 *  AbstractShape.ts of project stock-chart
 *  @date 2022/8/8 14:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Event from '../base/Event'

abstract class AbstractShape<E extends string> extends Event<E> {
  private _bounding: { left: number, top: number } | null = null

  abstract getElement (): HTMLElement

  private buildRect (el?: HTMLElement) {
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
}

export default AbstractShape
