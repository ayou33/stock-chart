/**
 *  canvas绘图基础类
 *
 *  AbstractCanvas.ts of project stock-chart
 *  @date 2022/8/19 16:39
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'
import { aa, createAAContext } from '../helper/aa'
import ICanvas, { Bounding } from '../interface/ICanvas'
import { InjectPosition, InjectTypes } from '../interface/IInjectable'
import LayoutCell from '../layout/LayoutCell'
import AbstractRenderer from './AbstractRenderer'

abstract class AbstractCanvas<E extends string = never> extends AbstractRenderer<E> implements ICanvas<E> {
  container: LayoutCell
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  bounding: { left: number, top: number } | null = null
  disabled = false

  private _lastFrame: HTMLImageElement | null = null

  protected constructor (container: LayoutCell, context?: CanvasRenderingContext2D | null) {
    super()

    this.container = container
    this.context = context ?? createAAContext(this.container.width(), this.container.height())
    this.canvas = this.context.canvas

    if (!context) this.render()
  }

  createBounding (el?: HTMLElement): Bounding {
    const element = el ?? this.canvas
    const rect = element.getBoundingClientRect()

    return this.bounding = {
      left: rect.left + element.clientLeft,
      top: rect.top + element.clientTop,
    }
  }

  pointer (x: number, y: number, el?: HTMLElement): Vector {
    if (el) {
      const bounding = this.createBounding(el)
      return [x - bounding.left, x - bounding.top]
    }

    if (!this.bounding) {
      this.createBounding()
    }

    if (this.bounding) {
      return [x - this.bounding.left, y - this.bounding.top]
    }

    return [x, x]
  }

  enable (show = false): this {
    this.disabled = false

    if (show) this.show()

    return this
  }

  disable (hide = false): this {
    this.disabled = true

    if (hide) this.hide()

    return this
  }

  prepend () {
    this.container.node().prepend(this.canvas)

    return this
  }

  append () {
    this.container.node().append(this.canvas)

    return this
  }

  insertTo (position: number) {
    const $parent = this.container.node()
    if ($parent.childElementCount >= Math.max(0, position + 1)) {
      const $ref = $parent.children.item(position)

      if ($ref) {
        $ref.insertAdjacentElement('afterend', this.canvas)
      }
    }

    return this
  }

  render () {
    this.append()

    return this
  }

  hide (): this {
    this.canvas.style.display = 'none'

    return this
  }

  show (): this {
    this.canvas.style.display = 'block'

    return this
  }

  save () {
    // release old img
    this._lastFrame = null

    const img = new Image(this.container.width(), this.container.height())
    img.src = this.canvas.toDataURL('image/png', 1)

    this._lastFrame = img

    return this
  }

  restore () {
    if (this._lastFrame) {
      this.clear()
      this.context.drawImage(this._lastFrame, 0, 0, this.container.width(), this.container.height())
    }

    return this
  }

  clear (): this {
    this.context.clearRect(0, 0, this.container.width(), this.container.height())

    return this
  }

  remove (): this {
    this.destroy()

    this.container.node().removeChild(this.canvas)

    return this
  }

  resize () {
    this.applyInject('resize', 'before')

    this.createBounding()

    aa(this.context, this.container.width(), this.container.height())

    this.applyInject('resize', 'after')

    this.replay()

    return this
  }

  applyInject (name: InjectTypes, position: InjectPosition): this {
    const handlers = position === 'before' ? this.beforeInjections[name]
                                           : this.afterInjections[name]

    handlers?.map(fn => fn(this))

    return this
  }

  abstract draw (update: UpdatePayload): this
}

export default AbstractCanvas
