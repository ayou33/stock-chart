/**
 *  MA.ts of project stock-chart
 *  @date 2022/8/18 17:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { pluck } from 'ramda'
import { maInputs, MAInputs } from '../../../options.indicator'
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator from '../../interface/IIndicator'
import { RenderOptions } from '../../options'
import AbstractIndicator from '../../super/AbstractIndicator'
import { Color } from '../../theme'
import calcMA from './formula'

type MAOutput = Flatten<ReturnType<typeof calcMA>>

type Key = `ma_${number}`

class MA extends AbstractIndicator<MAInputs, MAOutput> implements IIndicator<MAInputs> {
  private _periods: number[] = []
  private colors: Record<Key, Color> = {}

  constructor (options: RenderOptions & RecursivePartial<MAInputs>) {
    super(options, 'ma')

    this.applyConfig()
  }

  applyConfig (): this {
    this._periods = pluck('period', this.inputs.periods)
    this.inputs.periods.map(p => {
      this.colors[`ma_${p.period}` as Key] = p.color
    })

    return this
  }

  default (options?: RecursivePartial<MAInputs>): MAInputs {
    return extend(maInputs, options ?? {})
  }

  paintMA (ma: MAOutput[], period: number) {
    const key: Key = `ma_${period}`

    this.context.strokeStyle = this.colors[key]

    let start = false
    for (let i = 0, l = ma.length; i < l; i++) {
      const p = ma[i]
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

  compute (update: UpdatePayload) {
    return calcMA(update.bars.slice(0, -1), this._periods)
  }

  computeLatest (update: UpdatePayload): MAOutput[] {
    return calcMA(update.bars.slice(-Math.max(...this._periods) - 1), this._periods).slice(-1)
  }

  paint (result: MAOutput[]): this {

    for (let i = 0, l = this._periods.length; i < l; i++) {
      this.context.beginPath()
      this.paintMA(result, this._periods[i])
      this.context.stroke()
    }

    return this
  }
}

export default MA
