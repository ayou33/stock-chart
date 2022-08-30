/**
 *  @file         src/indicator/kdj/KDJ.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/30 15:23
 *  @description
 */
import { kdjInputs, KDJInputs } from '../../../options.indicator'
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator, { DisplayType } from '../../interface/IIndicator'
import AbstractIndicator from '../../super/AbstractIndicator'
import { calcStochastic, KDJValue } from './formula'

class KDJ extends AbstractIndicator<KDJInputs, KDJValue> implements IIndicator<KDJInputs> {
  static displayType = DisplayType.EXTERNAL

  private state: ReturnType<typeof calcStochastic>['state'] | null = null

  applyConfig (): this {
    return this
  }

  default (options: RecursivePartial<KDJInputs> | undefined): KDJInputs {
    return extend(kdjInputs, options ?? {})
  }

  paint (values: KDJValue[]): this {
    this.context.beginPath()

    let start = false

    for (let i = 0, l = values.length; i < l; i++) {
      const value = values[i]

      if (!value.index) continue

      if (start) {
        this.context.lineTo(this.fx(value.date), this.fy(value.index))
      } else {
        start = true
        this.context.moveTo(this.fx(value.date), this.fy(value.index))
      }
    }
    this.context.stroke()

    return this
  }

  compute (update: UpdatePayload): KDJValue[] {
    const result =  calcStochastic(update.bars.slice(0, -1), this.inputs)

    this.state = result.state

    return result.value
  }

  computeLatest (update: UpdatePayload): KDJValue[] {
    if (this.state) {
      return calcStochastic(update.bars, this.inputs, this.state).value
    }

    return []
  }

  isExternal (): boolean {
    return true
  }
}

export default KDJ
