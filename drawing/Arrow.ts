/**
 *  @file         stock-chart/drawing/Arrow.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/11/23 15:43
 *  @description
 */
import { assertIsDefined } from '../helper/assert'
import extend from '../helper/extend'
import { PointValue } from '../interface/IDrawing'
import IGraph from '../interface/IGraph'
import AbstractDrawing from '../super/AbstractDrawing'
import arrowUpSrc from './asset/arrow_up@2x.png'
import arrowDownSrc from './asset/arrow_down@2x.png'
import { themeOptions } from '../theme'

export type ArrowOptions = Partial<{
  toBottom: boolean;
}>

const WIDTH = 24
const HALF_WIDTH = WIDTH / 2
const HEIGHT = 24
const PADDING = 4

function transfer (x: number, y: number, down = false) {
  return {
    x: x - HALF_WIDTH,
    y: y - (down ? HEIGHT - PADDING : PADDING),
  }
}

export class Arrow extends AbstractDrawing<Required<ArrowOptions>> {
  private readonly $img = new Image()
  private _toBottom = false

  constructor (chart: IGraph, options?: ArrowOptions) {
    super(chart, extend({ toBottom: false }, options ?? {}))

    this.$img.onload = () => this.emit('refresh')

    this._toBottom = this.options.toBottom

    this.$img.src = this._toBottom ? arrowDownSrc : arrowUpSrc
  }

  draw (): this {
    const p = this.trace(0)

    assertIsDefined(p)

    const { date, price } = p

    const { x, y } = transfer(this.chart.fx(date), this.chart.fy(price), this._toBottom)
    const ctx = this.chart.context

    ctx.drawImage(this.$img, x, y, WIDTH, HEIGHT)

    return this
  }

  render (points: PointValue[]) {
    this.record(this.locate(points[0]))
    this.draw()
    this.emit('done')
    this.ready()

    return this
  }

  highlight () {
    const p = this.trace(0)
    const ctx = this.chart.context

    assertIsDefined(p)

    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = themeOptions.primaryColor
    ctx.lineWidth = 1

    const date = p?.date || 0
    const price = p?.price || 0

    ctx.arc(this.chart.fx(date), this.chart.fy(price), 5, 0, Math.PI * 2),

    ctx.stroke()
    ctx.restore()

    return this
  }

  test (mx: number, my: number): boolean {
    const p = this.trace(0)

    assertIsDefined(p)

    const { x, y } = transfer(p.x, p.y, this._toBottom)

    return mx >= x &&
      mx <= (x + WIDTH) &&
      my > y &&
      my < (y + HEIGHT)

  }
}

export default Arrow
