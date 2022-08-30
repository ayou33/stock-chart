/**
 *  @file         src/indicator/macd/MACD.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/23 16:05
 *  @description
 */
import { macdInputs, MACDInputs } from '../../../options.indicator'
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator, { DisplayType } from '../../interface/IIndicator'
import AbstractIndicator from '../../super/AbstractIndicator'
import calcMACD, { MACDValue } from './formula'

type MACDResult = ReturnType<typeof calcMACD>

type MACDState = MACDResult['state']

class MACD extends AbstractIndicator<MACDInputs, MACDValue> implements IIndicator<MACDInputs> {
  static displayType = DisplayType.EXTERNAL

  valueAlign = 0

  state: MACDState | null = null

  default (options?: RecursivePartial<MACDInputs>): MACDInputs {
    return extend(macdInputs, options ?? {})
  }

  applyConfig (): this {
    return this
  }

  paintMACD (data: MACDValue[]) {
    this.context.beginPath()
    this.context.strokeStyle = this.inputs.resultColor
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
    this.context.stroke()
  }

  paintSignal (data: MACDValue[]) {
    this.context.beginPath()
    this.context.strokeStyle = this.inputs.signalColor
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
    this.context.stroke()
  }

  paintHist (data: MACDValue[], width: number) {
    for (let i = 0, l = data.length; i < l; i++) {
      const value = data[i]

      if (!value.hist) continue

      const x = this.fx(value.date)
      let top = this.fy(value.hist)
      let bottom = this.fy(0)
      this.context.fillStyle = this.inputs.histRaiseColor
      if (value.hist < 0) {
        [top, bottom] = [bottom, top]
        this.context.fillStyle = this.inputs.histFallColor
      }
      this.context.fillRect(x, top, width, Math.abs(top - bottom))
    }
  }

  paint (values: MACDValue[]): this {
    this.yAxis.domain([300, -300])

    this.paintHist(values, this.xAxis.bandWidth())
    this.paintMACD(values)
    this.paintSignal(values)

    return this
  }

  compute (update: UpdatePayload) {
    const result = calcMACD(update.bars.slice(0, -1), this.inputs)
    this.state = result.state
    return result.value
  }

  computeLatest (update: UpdatePayload): MACDValue[] {
    if (this.state) {
      return calcMACD(update.bars, this.inputs, this.state).value
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
