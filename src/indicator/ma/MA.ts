/**
 *  MA.ts of project stock-chart
 *  @date 2022/8/18 17:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../../core/DataSource'
import IIndicator, { DisplayType } from '../../interface/IIndicator'
import AbstractIndicator from '../../super/AbstractIndicator'
import calcMA from './formula'

export type MAInputs = {
  inputs: {
    periods: number[];
  }
}

class MA extends AbstractIndicator<MAInputs> implements IIndicator<MAInputs> {
  static displayType = DisplayType.INNER

  drawAll (update: UpdatePayload): this {
    this.clear()

    const mas = calcMA(update.bars, this.inputs.periods)

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
}

export default MA
