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

type MACDResult = ReturnType<typeof calcMACD>

type MACDState = MACDResult['state']

type MACDValue = Flatten<MACDResult['value']>

class MACD extends AbstractIndicator<MACDInputs, MACDValue> implements IIndicator<MACDInputs> {
  static displayType = DisplayType.EXTERNAL

  valueAlign = 0

  state: MACDState | null = null

  paintMACD (data: MACDValue[]) {
    let start = false
    for (let i = 0, l = data.length; i < l; i++) {
      const value = data[i]

      if (!value.macd) continue

      if (start) {
        this.context.lineTo(this.fx(value.date, 0.5), this.fy(value.macd))
      } else {
        start = true
        this.context.moveTo(this.fx(value.date, 0.5), this.fy(value.macd))
      }
    }
  }

  paintSignal (data: MACDValue[]) {
    let start = false
    for (let i = 0, l = data.length; i < l; i++) {
      const value = data[i]

      if (!value.signal) continue

      if (start) {
        this.context.lineTo(this.fx(value.date, 0.5), this.fy(value.signal))
      } else {
        start = true
        this.context.moveTo(this.fx(value.date, 0.5), this.fy(value.signal))
      }
    }
  }

  paintHist (data: MACDValue[], width: number) {
    for (let i = 0, l = data.length; i < l; i++) {
      const value = data[i]

      if (!value.hist) continue

      const x = this.fx(value.date)
      let top = this.fy(value.hist)
      let bottom = this.fy(0)
      if (value.hist < 0) [top, bottom] = [bottom, top]
      this.context.fillRect(x, top, width, Math.abs(top - bottom))
    }
  }

  paint (data: MACDValue[]): this {
    this.yAxis.domain([300, -300])

    const ctx = this.context
    ctx.beginPath()

    this.paintMACD(data)
    this.paintSignal(data)
    this.paintHist(data, this.xAxis.bandWidth())

    ctx.stroke()

    return this
  }

  compute (update: UpdatePayload) {
    const result = calcMACD(update.bars.slice(0, -1))
    this.state = result.state
    return result.value
  }

  computeLatest (update: UpdatePayload): MACDValue[] {
    if (this.state) {
      return this.result.slice(-1).concat(calcMACD(update.bars.slice(-1), undefined, this.state).value)
    }

    return []
  }

  resetLatest (): this {
    const latest = this.lastUpdate?.latest
    if (latest) {
      const left = this.fx(latest.date) - this.xAxis.step() + this.xAxis.bandWidth() / 2
      const width = this.xAxis.step() * 2 - this.xAxis.bandWidth() / 2
      this.context.clearRect(left, 0, width, this.container.height())
    }
    return this
  }

  isExternal (): boolean {
    return true
  }
}

export default MACD
