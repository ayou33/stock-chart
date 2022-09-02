/**
 *  @file         src/indicator/ema/EMA.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/29 10:56
 *  @description
 */
import { emaInputs, EMAInputs } from '../../options.indicator'
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator from '../../interface/IIndicator'
import AbstractIndicator from '../../super/AbstractIndicator'
import { calcEMA, EMAName, EMAValue } from './formula'

class EMA extends AbstractIndicator<EMAInputs, EMAValue> implements IIndicator<EMAInputs> {
  private state: ReturnType<typeof calcEMA>['state'] | null = null

  applyConfig (): this {
    return this
  }

  compute (update: UpdatePayload): EMAValue[] {
    const result = calcEMA(update.bars, this.inputs)
    this.state = result.state
    return result.value
  }

  computeLatest (update: UpdatePayload): EMAValue[] {
    if (this.state) {
      return calcEMA(update.bars.slice(-1), this.inputs, this.state).value.slice(-1)
    }

    return []
  }

  default (options: RecursivePartial<EMAInputs> | undefined): EMAInputs {
    return extend(emaInputs, options ?? {})
  }

  paint (values: EMAValue[]): this {
    for (let i = 0, l = this.inputs.periods.length; i < l; i++) {
      const key = `index_${this.inputs.periods[i].period}_${this.inputs.periods[i].offset ?? 0}` as EMAName

      this.context.beginPath()
      this.context.strokeStyle = this.inputs.periods[i].color

      let start = false
      for (let j = 0, dl = values.length; j < dl; j++) {
        const bar = values[j]
        const ema = bar[key]

        if (!ema) continue

        if (start) {
          this.context.lineTo(this.fx(bar.date), this.fy(ema))
        } else {
          start = true
          this.context.moveTo(this.fx(bar.date), this.fy(ema))
        }
      }

      this.context.stroke()
    }

    return this
  }
}

export default EMA
