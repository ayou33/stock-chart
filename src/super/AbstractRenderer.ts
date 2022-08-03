/**
 *  顶层抽象渲染器
 *  AbstractRenderer.ts of project stock-chart
 *  @date 2022/8/3 15:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { createAAContext } from '../helper/aa'
import IMainAxis from '../interface/IMainAxis'
import IRenderer from '../interface/IRenderer'
import ISeries from '../interface/ISeries'
import { RendererOptions } from '../options'

abstract class AbstractRenderer<T = unknown> implements IRenderer {
  private _enable = true

  options: RendererOptions & T
  autoStroke = true

  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  xAxis: IMainAxis
  yAxis: ISeries

  protected constructor (options: RendererOptions & T) {
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
}

export default AbstractRenderer
