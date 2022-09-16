/**
 *  Gesture.ts of project stock-chart
 *  @date 2022/8/3 15:08
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { nanie, API, Transform } from 'nanie'
import { RendererOptions, StockChartOptions } from '../options'
import AbstractChart from '../super/AbstractChart'

export type GestureEvents = 'transform' | 'transformed'

class Gesture<T extends string = any> extends AbstractChart<GestureEvents | T, StockChartOptions> implements AbstractChart<GestureEvents | T> {
  zoom: API

  protected constructor (options: RendererOptions) {
    super(options)

    this.options = options

    this.canvas.style.cssText += `
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    `

    this.zoom = nanie(this.canvas, (e) => {
      if (e.type === 'zoom') {
        requestAnimationFrame(() => {
          const event = e.sourceEvent as MouseEvent
          const p = this.pointer(event.clientX, event.clientY)
          this.xAxis.transform(e.transform, p[0])
          this.yAxis.transform(e.transform)
          this.emit('transform')
        })
      }

      if (e.type === 'end') {
        this.emit('transformed', e.transform)
      }
    })
  }

  drawAll (): this {
    return this
  }

  drawLatest (): this {
    return this
  }

  applyTransform (transform: Transform) {
    this.zoom.apply(transform)
  }
}

export default Gesture
