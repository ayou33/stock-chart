/**
 *  AbstractCanvas.ts of project stock-chart
 *  @date 2022/8/11 16:39
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { createAAContext } from '../helper/aa'
import ICanvas from '../interface/ICanvas'
import AbstractShape from './AbstractShape'

abstract class AbstractCanvas<E extends string> extends AbstractShape<E> implements ICanvas {
  protected readonly container: ContainerCell
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  private _enable = true

  protected constructor (container: ContainerCell) {
    super()

    this.container = container
    this.context = createAAContext(container.width, container.height)
    this.canvas = this.context.canvas

    this.render()
  }

  enable (show = false): this {
    this._enable = true

    if (show) this.show()

    return this
  }

  disable (hide = false): this {
    this._enable = false

    if (hide) this.hide()

    return this
  }

  draw (...args: unknown[]): this {
    if (this._enable) {
      this.clear()
      this.paint(...args)
    }
    return this
  }

  render () {
    this.container.node.appendChild(this.canvas)

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

  clear (): this {
    this.context.clearRect(0, 0, this.container.width, this.container.height)

    return this
  }

  remove (): this {
    this.off('*')
    this.container.node.removeChild(this.canvas)

    return this
  }

  resize () {
    this.buildRect()
    this.draw()

    return this
  }

  getElement (): HTMLElement {
    return this.canvas
  }

  abstract paint (...args: unknown[]): this
}

export default AbstractCanvas
