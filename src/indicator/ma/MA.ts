/**
 *  MA.ts of project stock-chart
 *  @date 2022/8/18 17:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../../core/DataSource'
import IIndicator from '../../interface/IIndicator'
import { RenderOptions } from '../../options'
import AbstractIndicator from '../../super/AbstractIndicator'
import calcMA from './formula'

export type MAInputs = {
  inputs: {
    periods: number[];
  }
}

type MAResult = Flatten<ReturnType<typeof calcMA>>

class MA extends AbstractIndicator<MAInputs, MAResult> implements IIndicator<MAInputs> {
  constructor (options: RenderOptions & RecursivePartial<MAInputs>) {
    super(options, 'ma')
  }

  paintMA (ma: MAResult) {
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

  compute (update: UpdatePayload) {
    return calcMA(update.bars.slice(0, -1))
  }

  computeLatest (update: UpdatePayload): MAResult[] {
    // @todo 取最大的period - 1
    return calcMA(update.bars.slice(-14 - 1)).slice(-1)
  }

  paint (result: MAResult[]): this {
    this.context.beginPath()

    for (let i = 0, l = result.length; i < l; i++) {
      this.paintMA(result[i])
    }

    this.context.stroke()

    return this
  }

  isCached (update: UpdatePayload): boolean {
    return this.result[0]?.length === update.bars.length - 1
  }
}

export default MA
