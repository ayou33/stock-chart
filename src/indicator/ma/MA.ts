/**
 *  MA.ts of project stock-chart
 *  @date 2022/8/18 17:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator from '../../interface/IIndicator'
import { RendererOptions } from '../../options'
import AbstractChart from '../../super/AbstractChart'
import calcMA from './formula'

export type MAInput = {
  inputs: {
    periods: number[];
  }
}

const inputs: MAInput['inputs'] = {
  periods: [14]
}

class MA extends AbstractChart<''> implements IIndicator<MAInput> {
  private _inputs: MAInput['inputs']

  constructor (options: RendererOptions & RecursivePartial<MAInput>) {
    super(options)

    this._inputs = extend(inputs, options.inputs ?? {})
  }

  drawAll (update: UpdatePayload): this {
    const mas = calcMA(update.bars, this._inputs.periods)

    const ma = mas[0]
    const ctx = this.context

    ctx.save()
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
    ctx.restore()

    return this
  }

  drawLatest (update: UpdatePayload): this {
    console.log('jojo draw ma latest', update)
    return this
  }

  config (inputs: MAInput) {
    this._inputs = extend(this._inputs, inputs)

    super.apply()

    return this
  }
}

export default MA
