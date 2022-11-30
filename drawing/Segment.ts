/**
 *  @file         stock-chart/drawing/Segment.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/11/28 11:35
 *  @description
 */
import { lineOptions, LineOptions } from '../graphics/Line'
import { toAntiAAPointer } from '../helper/aa'
import extend from '../helper/extend'
import IGraph from '../interface/IGraph'
import AbstractDrawing from '../super/AbstractDrawing'

export type SegmentOptions = Partial<LineOptions & {}>

const POINT_COUNT = 2

export class Segment extends AbstractDrawing<LineOptions> {
  constructor (chart: IGraph, options?: SegmentOptions) {
    super(chart, extend(lineOptions, options ?? {}))
  }

  use ([x, y]: Vector): this {
    this.record(this.evaluate({ x, y }))

    if (this.count() >= POINT_COUNT) {
      this.emit('end', this, (ok: boolean) => {
        this.emit(ok ? 'done' : 'fail')
        if (ok) this.ready()
      })
    }

    return this
  }

  draw () {
    const ps = this.trace()

    if (ps.length >= 2) {
      const start = ps[0]
      const end = ps[1]

      const ctx = this.chart.context
      ctx.beginPath()
      ctx.strokeStyle = this.options.color
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()

    }
    return this
  }

  test (_x: number, _y: number): boolean {
    const ps = this.trace()
    if (ps.length >= 2) {
      const one = ps[0]
      const another = ps[1]
      const ctx = this.chart.context

      const pad = 4
      ctx.beginPath()
      ctx.moveTo(one.x, one.y - pad)
      ctx.lineTo(another.x, another.y - pad)
      ctx.lineTo(another.x, another.y + pad)
      ctx.lineTo(one.x, one.y + pad)
      ctx.closePath()

      return ctx.isPointInPath(...toAntiAAPointer([_x, _y]))
    }

    return false
  }

  testPoint (x: number, y: number): number | null {
    const ctx = this.chart.context

    let hitPointIndex: number | null = null
    this.trace().find((p, i) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
      return ctx.isPointInPath(...toAntiAAPointer([x, y])) && (hitPointIndex = i)
    })

    return hitPointIndex
  }
}

export default Segment