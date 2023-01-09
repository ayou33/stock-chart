/**
 *  @file         src/indicator/cci/CCI.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/30 15:03
 *  @description
 */
import { extent } from '../../helper/extent'
import { cciInputs, CCIInputs } from '../../options.indicator'
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

  computeInit (update: UpdatePayload): CCIValue[] {
    return calcCCI(update.bars.slice(0, -1), this.inputs)
  }

  computeLast (update: UpdatePayload): CCIValue[] {
    return calcCCI(update.bars.slice(-this.inputs.period), this.inputs)
  }

  default (options: RecursivePartial<CCIInputs> | undefined): CCIInputs {
    return extend(cciInputs, options ?? {})
  }

  beforeRepaint (values: CCIValue[]): this {
    this.yAxis.domain(extent(values, d => d.index, d => d.index).reverse() as Extent)

    return this
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
