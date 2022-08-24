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

type MACDOutput = ReturnType<typeof calcMACD>

class MACD extends AbstractIndicator<MACDInputs, MACDOutput> implements IIndicator<MACDInputs> {
  static displayType = DisplayType.EXTERNAL

  paintMACD (data: MACDOutput['value']) {
    let start = false
    for (let i = 0, l = data.length; i < l; i++) {
      const value = data[i]

      if (!value.macd) continue

      if (start) {
        this.context.lineTo(this.fx(value.date), this.fy(value.macd))
      } else {
        start = true
        this.context.moveTo(this.fx(value.date), this.fy(value.macd))
      }
    }
  }

  paintSignal (data: MACDOutput['value']) {
    let start = false
    for (let i = 0, l = data.length; i < l; i++) {
      const value = data[i]

      if (!value.signal) continue

      if (start) {
        this.context.lineTo(this.fx(value.date), this.fy(value.signal))
      } else {
        start = true
        this.context.moveTo(this.fx(value.date), this.fy(value.signal))
      }
    }
  }

  paintHist (data: MACDOutput['value'], width: number) {
    for (let i = 0, l = data.length; i < l; i++) {
      const value = data[i]

      if (!value.hist) continue

      const x = this.fx(value.date)
      let top = this.fy(value.hist)
      let bottom = this.fy(0)
      if (value.hist < 0) [top, bottom] = [bottom, top]
      this.context.fillRect(x - width / 2, top, width, Math.abs(top - bottom))
    }
  }

  paintAll (output: MACDOutput): this {
    this.yAxis.domain([300, -300])

    const ctx = this.context
    ctx.beginPath()

    const data = output.value

    this.paintMACD(data)
    this.paintSignal(data)
    this.paintHist(data, this.xAxis.bandWidth())

    ctx.stroke()

    return this
  }

  clearLatest (): this {
    return this
  }

  paintLatest (): this {
    return this
  }

  calc (update: UpdatePayload) {
    return calcMACD(update.bars)
  }

  isExternal (): boolean {
    return true
  }
}

export default MACD
