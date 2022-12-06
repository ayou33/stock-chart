/**
 *  @file         stock-chart/drawing/Segment.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/11/28 11:35
 *  @description
 */
import { lineOptions, LineOptions } from '../graphics/Line'
import { toAntiAAPointer, createPointsOutline } from '../helper/aa'
import extend from '../helper/extend'
import IGraph from '../interface/IGraph'
import AbstractDrawing from '../super/AbstractDrawing'
import { themeOptions } from '../theme'

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
      ctx.moveTo(this.chart.fx(start.date), this.chart.fy(start.price))
      ctx.lineTo(this.chart.fx(end.date), this.chart.fy(end.price))
      ctx.stroke()

    }
    return this
  }

  highlight () {
    const ps = this.trace()

    const ctx = this.chart.context
    ctx.strokeStyle = themeOptions.primaryColor

    for(let i = 0; i < ps.length; i++) {
      const date = ps[i].date
      const price = ps[i].price
      ctx.beginPath()
      ctx.arc(this.chart.fx(date), this.chart.fy(price), 5, 0, Math.PI * 2)
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

      // const points = ps.map(item => {
      //   return {
      //     x: this.chart.fx(item.date),
      //     y: this.chart.fy(item.price)
      //   }
      // })
      // createPointsOutline(ctx, points, pad)

      return ctx.isPointInPath(...toAntiAAPointer([_x, _y]))
    }

    return false
  }

  testPoint (x: number, y: number): number | null {
    const ctx = this.chart.context

    let hitPointIndex: number | null = null
    console.log(this.trace())
    this.trace().find((p, i) => {
      ctx.beginPath()
      ctx.arc(this.chart.fx(p.date), this.chart.fy(p.price), 5, 0, Math.PI * 2)
      return ctx.isPointInPath(...toAntiAAPointer([x, y])) && (hitPointIndex = i)
    })

    return hitPointIndex
  }
}

export default Segment
