/**
 *  Gesture.ts of project stock-chart
 *  @date 2022/8/3 15:08
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { nanie, API, Transform } from 'nanie'
import { RendererOptions, StockChartOptions } from '../options'
import AbstractShape from '../super/AbstractShape'

export type GestureEvents = 'transform' | 'transformed' | 'click'

class Gesture<T extends string = any> extends AbstractShape<GestureEvents | T, StockChartOptions> implements AbstractShape<GestureEvents | T> {
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
      const event = e.sourceEvent as MouseEvent
      const p = this.pointer(event.clientX, event.clientY)

      if (e.type === 'zoom') {
        requestAnimationFrame(() => {
          this.xAxis.transform(e.transform, p[0])
          this.yAxis.transform(e.transform)
          this.emit('transform')
        })
      } else if (e.type === 'end') {
        this.emit('transformed', e.transform)
      } else if (e.type === 'click') {
        this.emit('click', p)
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