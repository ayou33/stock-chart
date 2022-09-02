/**
 *  @file         src/indicator/rsi/RSI.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/30 16:28
 *  @description
 */
import { rsiInputs, RSIInputs } from '../../options.indicator'
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator, { DisplayType } from '../../interface/IIndicator'
import AbstractIndicator from '../../super/AbstractIndicator'
import { calcRSI, RSIValue } from './formula'

class RSI extends AbstractIndicator<RSIInputs, RSIValue> implements IIndicator<RSIInputs> {
  static displayType = DisplayType.EXTERNAL

  displayType = DisplayType.EXTERNAL

  private state: ReturnType<typeof calcRSI>['state'] | null = null

  isExternal (): boolean {
    return true
  }

  applyConfig (): this {
    return this
  }

  compute (update: UpdatePayload): RSIValue[] {
    const result = calcRSI(update.bars.slice(0, -1), this.inputs)

    this.state = result.state

    return result.value
  }

  computeLatest (update: UpdatePayload): RSIValue[] {
    if (this.state) {
      return calcRSI(update.bars, this.inputs, this.state).value
    }

    return []
  }

  default (options: RecursivePartial<RSIInputs> | undefined): RSIInputs {
    return extend(rsiInputs, options ?? {})
  }

  paint (values: RSIValue[]): this {
    this.context.beginPath()

    let start = false
    for (let i = 0, l = values.length; i < l; i++) {
      if (!values[i][`index_14`]) continue

      if (start) {
        this.context.lineTo(this.fx(values[i].date), this.fy(values[i][`index_${14}`]))
      } else {
        start = true
        this.context.moveTo(this.fx(values[i].date), this.fy(values[i][`index_${14}`]))
      }
    }
    this.context.stroke()

    return this
  }
}

export default RSI
