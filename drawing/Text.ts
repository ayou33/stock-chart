/**
 *  @file         stock-chart/drawing/Text.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/11/25 10:48
 *  @description
 */
import { assertIsDefined } from '../helper/assert'
import extend from '../helper/extend'
import { measureText } from '../helper/typo'
import IGraph from '../interface/IGraph'
import AbstractDrawing from '../super/AbstractDrawing'
import { Color, themeOptions } from '../theme'

export type TextOptions = {
  text: string;
  color?: Color;
}

export class Text extends AbstractDrawing<Required<TextOptions>> {
  private _measure: ReturnType<typeof measureText> | null = null

  constructor (chart: IGraph, options: TextOptions) {
    super(chart, extend({ color: '#000', text: 'Text' }, options))
  }

  draw () {
    const p = this.trace(0)
    assertIsDefined(p)
    const { date, price } = p
    const ctx = this.chart.context

    ctx.save()
    ctx.font = '14px Roboto'
    ctx.textBaseline = 'bottom'
    ctx.fillStyle = this.options.color
    ctx.fillText(this.options.text, this.chart.fx(date), this.chart.fy(price))
    ctx.restore()

    this.updateTextBounding()

    return this
  }

  highlight () {
    const ctx = this.chart.context
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = themeOptions.primaryColor
    ctx.lineWidth = 1

    const date = this.trace(0)?.date || 0
    const price = this.trace(0)?.price || 0

    ctx.arc(this.chart.fx(date), this.chart.fy(price), 5, 0, Math.PI * 2),

    ctx.stroke()
    ctx.restore()

    return this
  }

  updateTextBounding (force = false) {
    if (force || !this._measure) {
      this._measure = measureText(this.chart.context, this.options.text)
    }
  }

  update (_options: Partial<TextOptions>) {
    this.options = extend(this.options, _options)
    this.updateTextBounding(true)
    this.emit('refresh')

    return this
  }

  test (x: number, y: number) {
    const p = this.trace(0)

    assertIsDefined(p)
    assertIsDefined(this._measure)
    const { x: left, y: top } = p

    return x >= left - 8 &&
      x <= left + this._measure.width + 8 &&
      y <= top + 8 &&
      y >= top - this._measure.height - 8
  }
}

export default Text
