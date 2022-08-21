/**
 *  MA.ts of project stock-chart
 *  @date 2022/8/18 17:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator, { DisplayType } from '../../interface/IIndicator'
import { RenderOptions } from '../../options'
import AbstractChart from '../../super/AbstractChart'
import calcMA from './formula'

export type MAInputs = {
  inputs: {
    periods: number[];
  }
}

const inputs: MAInputs['inputs'] = {
  periods: [14]
}

class MA extends AbstractChart implements IIndicator<MAInputs> {
  readonly displayType = DisplayType.INNER

  static displayType = DisplayType.INNER

  private _inputs: MAInputs['inputs']

  constructor (options: RenderOptions & RecursivePartial<MAInputs>) {
    super(options)

    this._inputs = extend(inputs, options.inputs ?? {})
  }

  drawAll (update: UpdatePayload): this {
    this.clear()

    const mas = calcMA(update.bars, this._inputs.periods)

    const ma = mas[0]
    const ctx = this.context

    ctx.beginPath()
    let start = false
    for (let i = 0, l = ma.length; i < l; i++) {
      const p = ma[i]
      if (!p.ma) continue
      if (start) {
        ctx.lineTo(this.xAxis.value(p.date), this.yAxis.value(p.ma))
      } else {
        start = true
        ctx.moveTo(this.xAxis.value(p.date), this.yAxis.value(p.ma))
      }
    }
    ctx.stroke()

    return this
  }

  drawLatest (update: UpdatePayload): this {
    console.log('jojo draw ma latest', update)
    return this
  }

  config (inputs: MAInputs) {
    this._inputs = extend(this._inputs, inputs)

    super.apply()

    return this
  }
}

export default MA
