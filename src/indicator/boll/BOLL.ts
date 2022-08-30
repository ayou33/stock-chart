/**
 *  @file         src/indicator/boll/BOLL.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/29 15:27
 *  @description
 */
import { bollInputs, BOLLInputs } from '../../../options.indicator'
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

  compute (update: UpdatePayload): BOLLValue[] {
    const result = calcBOLL(update.bars.slice(0, -1), this.inputs)

    this.state = result.state

    return result.value
  }

  computeLatest (update: UpdatePayload): BOLLValue[] {
    if (this.state) {
      return calcBOLL(update.bars, this.inputs, this.state).value
    }

    return []
  }

  paint (values: BOLLValue[]): this {
    this.context.beginPath()
    this.context.strokeStyle = this.inputs.channelColor

    let start = false
    for (let i = 0, l = values.length; i < l; i++) {

      if (start) {
        this.context.lineTo(this.fx(values[i].date), this.fy(values[i].index))
      } else {
        this.context.moveTo(this.fx(values[i].date), this.fy(values[i].index))
        start = true
      }

    }

    this.context.stroke()

    return this
  }

}

export default BOLL
