/**
 *  MA.ts of project stock-chart
 *  @date 2022/8/18 17:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../../core/DataSource'
import IIndicator from '../../interface/IIndicator'
import AbstractIndicator from '../../super/AbstractIndicator'
import calcMA from './formula'

export type MAInputs = {
  inputs: {
    periods: number[];
  }
}

type MAOutput = ReturnType<typeof calcMA>

class MA extends AbstractIndicator<MAInputs, MAOutput> implements IIndicator<MAInputs> {
  clearLatest (): this {
    return this
  }

  paintMA (ma: MAOutput[number]) {
    let start = false
    for (let i = 0, l = ma.length; i < l; i++) {
      const p = ma[i]
      if (!p.ma) continue

      if (start) {
        this.context.lineTo(this.fx(p.date), this.fy(p.ma))
      } else {
        start = true
        this.context.moveTo(this.fx(p.date), this.fy(p.ma))
      }
    }
  }

  paintAll (o: MAOutput): this {
    this.context.beginPath()
    for (let i = 0, l = o.length; i < l; i++) {
      this.paintMA(o[i])
    }
    this.context.stroke()

    return this
  }

  paintLatest (): this {
    return this
  }

  calc (update: UpdatePayload): MAOutput {
    return calcMA(update.bars)
  }
}

export default MA
