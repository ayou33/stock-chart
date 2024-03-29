/**
 *  Gesture.ts of project stock-chart
 *  @date 2022/8/3 15:08
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { nanie, API, Transform } from 'nanie'
import { GraphOptions, StockChartOptions } from '../options'
import AbstractGraph from '../super/AbstractGraph'

export type GestureEvents = 'transform' | 'transformed' | 'click' | 'contextmenu'

class Gesture<T extends string = any> extends AbstractGraph<GestureEvents | T, StockChartOptions> implements AbstractGraph<GestureEvents | T> {
  zoom: API | null = null

  protected constructor (options: StockChartOptions & GraphOptions) {
    super(options)

    this.options = options

    this.canvas.style.cssText += `
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    `

    this.canvas.oncontextmenu = e => this.emit('contextmenu', e)

    if (options.zoom) {
      this.zoom = nanie(this.canvas, e => {
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
          if ((e.sourceEvent as MouseEvent).button === 0) {
            this.emit('click', p)
          }
        }
      })
    }
  }

  drawAll (): this {
    return this
  }

  drawLast (): this {
    return this
  }

  applyTransform (transform: Transform, duration = 0) {
    this.zoom?.apply(transform, duration)
  }
}

export default Gesture
