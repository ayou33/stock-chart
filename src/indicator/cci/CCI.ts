/**
 *  @file         src/indicator/cci/CCI.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/30 15:03
 *  @description
 */
import { cciInputs, CCIInputs } from '../../../options.indicator'
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator, { DisplayType } from '../../interface/IIndicator'
import AbstractIndicator from '../../super/AbstractIndicator'
import { calcCCI, CCIValue } from './formula'

class CCI extends AbstractIndicator<CCIInputs, CCIValue> implements IIndicator<CCIInputs> {
  static displayType = DisplayType.EXTERNAL

  displayType = DisplayType.EXTERNAL

  isExternal (): boolean {
    return true
  }

  applyConfig (): this {
    return this
  }

  compute (update: UpdatePayload): CCIValue[] {
    return calcCCI(update.bars.slice(0, -1), this.inputs)
  }

  computeLatest (update: UpdatePayload): CCIValue[] {
    return calcCCI(update.bars.slice(-this.inputs.period), this.inputs)
  }

  default (options: RecursivePartial<CCIInputs> | undefined): CCIInputs {
    return extend(cciInputs, options ?? {})
  }

  paint (values: CCIValue[]): this {
    this.context.beginPath()
    let start = false
    for (let i = 0, l = values.length; i < l; i++) {
      if (!values[i].index) continue

      if (start) {
        this.context.lineTo(this.fx(values[i].date), this.fy(values[i].index))
      } else {
        start = true
        this.context.moveTo(this.fx(values[i].date), this.fy(values[i].index))
      }
    }
    this.context.stroke()

    return this
  }
}

export default CCI
