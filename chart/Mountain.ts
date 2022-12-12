import * as R from 'ramda'
import { UpdatePayload } from '../core/DataSource'
import { GraphOptions, StockChartOptions } from '../options'
import AbstractChart from '../super/AbstractChart'
import { ThemeOptions } from '../theme'

const isStringColor = R.pathSatisfies(R.is(String), ['theme', 'mountainColor'])

/**
 *  @file         stock-chart/chart/Mountain.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/12/12 14:25
 *  @description
 */
export class Mountain extends AbstractChart {
  color
  gradient

  constructor (options: GraphOptions & StockChartOptions) {
    super(options)

    this.color =
      isStringColor(options) ? ((options.theme as ThemeOptions).primaryColor as string) : '#000'
    const gradient = this.context.createLinearGradient(0, 0, 0, this.container.height())
    gradient.addColorStop(0, this.color)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    this.gradient = gradient
  }

  /**
   * @implements {AbstractChart#drawAll}
   * @param update
   */
  drawAll (update: UpdatePayload): this {
    const bars = update.bars

    if (bars.length < 2) {
      return this
    }

    const ctx = this.context
    ctx.beginPath()
    ctx.moveTo(this.fx(bars[0].date), this.fy(bars[0].close))

    for (let i = 1, l = bars.length; i < l - 1; i++) {
      const bar = bars[i]
      ctx.lineTo(this.fx(bar.date), this.fy(bar.close))
    }
    ctx.strokeStyle = this.color
    ctx.stroke()

    // fill
    const last = R.nth(-2, bars)
    if (last) {
      ctx.lineTo(this.fx(last.date), this.container.height())
      ctx.lineTo(this.fx(bars[0].date), this.container.height())
      ctx.closePath()
      ctx.fillStyle = this.gradient
      ctx.fill()
    }

    return this
  }

  /**
   * @implements {AbstractChart#drawLatest}
   * @param update
   */
  drawLatest (update: UpdatePayload): this {
    const latest = update.bars.slice(-2)
    if (latest.length >= 2) {
      this.context.beginPath()
      this.context.moveTo(this.fx(latest[0].date), this.fy(latest[0].close))
      this.context.lineTo(this.fx(latest[1].date), this.fy(latest[1].close))
      this.context.strokeStyle = this.color
      this.context.stroke()

      // fill
      this.context.lineTo(this.fx(latest[1].date), this.container.height())
      this.context.lineTo(this.fx(latest[0].date), this.container.height())
      this.context.closePath()
      this.context.fillStyle = this.gradient
      this.context.fill()
    }

    return this
  }
}

export default Mountain
