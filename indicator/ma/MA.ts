/**
 *  MA.ts of project stock-chart
 *  @date 2022/8/18 17:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { pluck } from 'ramda'
import { maInputs, MAInputs } from '../../options.indicator'
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator, { IndexName } from '../../interface/IIndicator'
import { GraphOptions } from '../../options'
import AbstractIndicator from '../../super/AbstractIndicator'
import { Color } from '../../theme'
import calcMA, { MAValue } from './formula'

class MA extends AbstractIndicator<MAInputs, MAValue> implements IIndicator<MAInputs> {
  private _series: number[] = []
  private colors: Record<IndexName, Color> = {}

  constructor (options: GraphOptions & RecursivePartial<MAInputs>) {
    super(options, 'ma')

    this.applyConfig()
  }

  applyConfig (): this {
    this._series = pluck('period', this.inputs.series)

    this.inputs.series.map(p => {
      this.colors[`index_${p.period}`] = p.color
    })

    return this
  }

  default (options?: RecursivePartial<MAInputs>): MAInputs {
    return extend(maInputs, options ?? {})
  }

  paintMA (values: MAValue[], period: number) {
    const key: IndexName = `index_${period}`

    this.context.strokeStyle = this.colors[key]

    let start = false
    for (let i = 0, l = values.length; i < l; i++) {
      const p = values[i]
      const value = p[key]

      if (!value) continue

      if (start) {
        this.context.lineTo(this.fx(p.date), this.fy(value))
      } else {
        start = true
        this.context.moveTo(this.fx(p.date), this.fy(value))
      }
    }
  }

  computeInit (update: UpdatePayload) {
    return calcMA(update.bars.slice(0, -1), this._series)
  }

  computeLast (update: UpdatePayload): MAValue[] {
    return calcMA(update.bars.slice(-Math.max(...this._series) - 1), this._series).slice(-1)
  }

  paint (result: MAValue[]): this {
    for (let i = 0, l = this._series.length; i < l; i++) {
      this.context.beginPath()
      this.paintMA(result, this._series[i])
      this.context.stroke()
    }

    return this
  }
}

export default MA
