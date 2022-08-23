/**
 *  @file         src/indicator/macd/MACD.ts created by WebStorm
 *  @project      stock-chart
 *  @author       ayooo[ayooooo@petalmail.com]
 *  @date         2022/8/23 16:05
 *  @description
 */
import { UpdatePayload } from '../../core/DataSource'
import IIndicator, { DisplayType } from '../../interface/IIndicator'
import AbstractIndicator from '../../super/AbstractIndicator'
import calcMACD from './formula'

export type MACDInputs = {
  inputs: {
    periods: number;
  };
}

class MACD extends AbstractIndicator<MACDInputs> implements IIndicator<MACDInputs> {
  static displayType = DisplayType.EXTERNAL

  drawAll (update: UpdatePayload): this {
    this.clear()

    this.yAxis.domain([200, -200])

    const ctx = this.context
    ctx.beginPath()

    const data = calcMACD(update.bars).value[0]

    let start = false
    for (let i = 0, l = data.length; i < l; i++) {
      const value = data[i]

      if (!value.c) continue

      if (start) {
        ctx.lineTo(this.fx(value.t), this.fy(value.c))
      } else {
        start = true
        ctx.moveTo(this.fx(value.t), this.fy(value.c))
      }
    }

    ctx.stroke()

    return this
  }

  drawLatest (update: UpdatePayload): this {
    return this
  }

  isExternal (): boolean {
    return true
  }
}

export default MACD
