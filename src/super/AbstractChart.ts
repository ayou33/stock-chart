/**
 *  顶层抽象渲染器
 *  AbstractRenderer.ts of project stock-chart
 *  @date 2022/8/3 15:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Event from '../base/Event'
import { createAAContext } from '../helper/aa'
import IAxis from '../interface/IAxis'
import IChart from '../interface/IChart'
import { RendererOptions } from '../options'

abstract class AbstractChart<E extends string, T = unknown> extends Event<E> implements IChart {
  options: RendererOptions & T
  autoStroke = true
  xAxis: IAxis
  yAxis: IAxis
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  private _enable = true

  protected constructor (options: RendererOptions & T) {
    super()

    this.options = options

    this.autoStroke = options.autoStroke ?? !options.context

    if (options.context) {
      this.context = options.context
    } else {
      this.context = createAAContext(options.container.width, options.container.height)
    }

    this.canvas = this.context.canvas

    this.yAxis = options.yAxis

    this.xAxis = options.xAxis

    return this
  }

  abstract paint (...args: unknown[]): this

  draw (...args: unknown[]) {
    if (this._enable) this.paint(...args)

    return this
  }

  render () {
    this.options.container.node.appendChild(this.canvas)

    return this
  }

  enable (show = false): this {
    this._enable = true

    if (show) this.show()

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

  disable (hide = false): this {
    this._enable = false

    if (hide) this.hide()

    return this
  }

  clear (): this {
    this.context.clearRect(0, 0, this.options.container.width, this.options.container.height)

    return this
  }

  remove (): this {
    this.options.container.node.removeChild(this.canvas)

    return this
  }
}

export default AbstractChart
