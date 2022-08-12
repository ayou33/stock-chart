/**
 *  AbstractCanvas.ts of project stock-chart
 *  @date 2022/8/11 16:39
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'
import { aa, createAAContext } from '../helper/aa'
import ICanvas from '../interface/ICanvas'
import IInjectable, { InjectPosition, InjectTypes } from '../interface/IInjectable'
import AbstractShape from './AbstractShape'

abstract class AbstractCanvas<E extends string> extends AbstractShape<E> implements ICanvas, IInjectable {
  protected readonly container: ContainerCell
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  disabled = false
  lastUpdate: UpdatePayload | null = null

  protected constructor (container: ContainerCell) {
    super()

    this.container = container
    this.context = createAAContext(container.width, container.height)
    this.canvas = this.context.canvas

    this.render()
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

  draw (update?: UpdatePayload): this {
    this.applyInject('update', 'before')

    if (!this.disabled) {
      if (update) this.lastUpdate = update

      if (this.lastUpdate) {
        this.applyInject('draw', 'before')
        this.clear()
        this.paint(this.lastUpdate)
        this.applyInject('draw', 'after')
      }
    }

    this.applyInject('update', 'after')

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
    this.ejectAll('*')
    this.container.node.removeChild(this.canvas)

    return this
  }

  resize () {
    this.applyInject('resize', 'before')

    this.buildRect()

    aa(this.context, this.container.width, this.container.height)

    this.applyInject('resize', 'after')

    this.draw()

    return this
  }

  getElement (): HTMLElement {
    return this.canvas
  }

  applyInject (name: InjectTypes, position: InjectPosition): this {
    const handlers = position === 'before' ? this.beforeInjections[name] : this.afterInjections[name]

    handlers.map(fn => fn(this.context, this.lastUpdate, this.container))

    return this
  }

  abstract paint (update: UpdatePayload): this
}

export default AbstractCanvas
