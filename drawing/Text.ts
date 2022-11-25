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
import { Color } from '../theme'

export type TextOptions = {
  text: string;
  color?: Color;
}

export class Text extends AbstractDrawing<Required<TextOptions>> {
  private _measure: ReturnType<typeof measureText> | null = null

  constructor (chart: IGraph, options: TextOptions) {
    super(chart, extend({ color: '#000', text: 'Type text' }, options))
  }

  draw () {
    const p = this.trace(0)
    assertIsDefined(p)
    const { x, y } = p

    const ctx = this.chart.context

    ctx.fillStyle = this.options.color
    ctx.fillText(this.options.text || 'text', x, y)

    this.updateTextBounding()

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

    return x >= left &&
      x <= left + this._measure.width &&
      y >= top &&
      y <= top + this._measure.height
  }
}

export default Text
