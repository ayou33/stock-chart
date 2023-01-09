/**
 *  @file         stock-chart/indicator/trend/Trend.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/14 14:12
 *  @description
 */
import { UpdatePayload } from '../../core/DataSource'
import extend from '../../helper/extend'
import IIndicator from '../../interface/IIndicator'
import { trendInputs, TrendInputs } from '../../options.indicator'
import AbstractIndicator from '../../super/AbstractIndicator'
import { calcTrend, TrendValue } from './formula'

class Trend extends AbstractIndicator<TrendInputs, TrendValue> implements IIndicator<TrendInputs> {
  state: ReturnType<typeof calcTrend>['state'] | null = null

  valueAlign = 0

  applyConfig (): this {
    return this
  }

  default (options: RecursivePartial<TrendInputs> | undefined): TrendInputs {
    return extend(trendInputs, options ?? {})
  }

  computeInit (update: UpdatePayload): TrendValue[] {
    const result = calcTrend(update.bars.slice(0, -1), this.inputs)

    this.state = result.state

    return result.value
  }

  computeLast (update: UpdatePayload): TrendValue[] {
    if (this.state) {
      return calcTrend(update.bars, this.inputs, this.state).value
    }

    return []
  }

  drawLast (update: UpdatePayload): this {
    this.paint(this.computeLast(update))

    return this
  }

  paint (values: TrendValue[]): this {
    const step = this.xAxis.step()
    const radius = this.xAxis.bandWidth() / 2

    for (let i = 0, l = values.length; i < l; i++) {
      const value = values[i]

      if (value.turn) {
        this.context.beginPath()
        this.context.strokeStyle = value.turn > 0 ? this.inputs.bullishColor
                                                  : this.inputs.bearishColor
        this.context.arc(
          this.fx(value.date, 0.5),
          this.fy(value.turn > 0 ? value.high : value.low) - value.turn * radius, radius, 0,
          Math.PI * 2,
        )
        this.context.stroke()
      }

      if (value.trend) {
        this.context.fillStyle = value.trend > 0 ? this.inputs.bearishBg : this.inputs.bullishBg
        this.context.fillRect(this.fx(value.date, 0), 0, step, this.container.height())
      }
    }

    return this
  }
}

export default Trend
