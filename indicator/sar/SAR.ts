/**
 *  @file         src/indicator/sar/SAR.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/30 15:05
 *  @description
 */
import { sarInputs, SARInputs } from '../../options.indicator'
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator from '../../interface/IIndicator'
import AbstractIndicator from '../../super/AbstractIndicator'
import { calcSAR, SARValue } from './formula'

class SAR extends AbstractIndicator<SARInputs, SARValue> implements IIndicator<SARInputs> {
  private state: ReturnType<typeof calcSAR>['state'] | null = null

  applyConfig (): this {
    return this
  }

  default (options: RecursivePartial<SARInputs> | undefined): SARInputs {
    return extend(sarInputs, options ?? {})
  }

  computeInit (update: UpdatePayload): SARValue[] {
    const result = calcSAR(update.bars.slice(0, -1), this.inputs)

    this.state = result.state

    return result.value
  }

  computeLast (update: UpdatePayload): SARValue[] {
    if (this.state) {
      return calcSAR(update.bars.slice(-2), this.inputs, this.state).value
    }

    return []
  }

  paint (values: SARValue[]): this {
    const radius = this.xAxis.bandWidth() / 2

    for (let i = 0, l = values.length; i < l; i++) {
      const bar = values[i]
      this.context.beginPath()
      this.context.strokeStyle = this.inputs.color
      this.context.arc(this.fx(bar.date), this.fy(bar.index), radius, 0, Math.PI * 2)
      this.context.stroke()
    }

    return this
  }
}

export default SAR
