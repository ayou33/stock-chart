/**
 *  @file         src/indicator/boll/BOLL.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/29 15:27
 *  @description
 */
import { bollInputs, BOLLInputs } from '../../options.indicator'
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator from '../../interface/IIndicator'
import AbstractIndicator from '../../super/AbstractIndicator'
import { BOLLValue, calcBOLL } from './formula'

class BOLL extends AbstractIndicator<BOLLInputs, BOLLValue> implements IIndicator<BOLLInputs> {
  private state: ReturnType<typeof calcBOLL>['state'] | null = null

  applyConfig (): this {
    return this
  }

  default (options: RecursivePartial<BOLLInputs> | undefined): BOLLInputs {
    return extend(bollInputs, options ?? {})
  }

  computeInit (update: UpdatePayload): BOLLValue[] {
    const result = calcBOLL(update.bars.slice(0, -1), this.inputs)

    this.state = result.state

    return result.value
  }

  computeLast (update: UpdatePayload): BOLLValue[] {
    if (this.state) {
      return calcBOLL(update.bars, this.inputs, this.state).value
    }

    return []
  }

  paint (values: BOLLValue[]): this {
    const band: Array<Record<'date' | 'value', number>> = []
    const ctx = this.context

    ctx.beginPath()
    ctx.strokeStyle = this.inputs.channelColor

    const count = values.length
    let start = false
    for (let i = 0; i < count; i++) {
      const value = values[i]
      band[i] = {
        date: value.date,
        value: value.high,
      }
      band[count + i] = {
        date: values[count - 1 - i].date,
        value: values[count - 1 - i].low
      }

      if (start) {
        ctx.lineTo(this.fx(value.date), this.fy(values[i].index))
      } else {
        ctx.moveTo(this.fx(values[i].date), this.fy(values[i].index))
        start = true
      }
    }

    ctx.stroke()

    ctx.beginPath()
    ctx.fillStyle = this.inputs.bandColor
    ctx.moveTo(this.fx(band[0].date), this.fy(band[0].value))
    for (let i = 1, l = band.length; i < l; i++) {
      ctx.lineTo(this.fx(band[i].date), this.fy(band[i].value))
    }
    ctx.closePath()
    ctx.fill()

    return this
  }
}

export default BOLL
