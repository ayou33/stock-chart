/**
 *  Candle.ts of project stock-chart
 *  @date 2022/7/25 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 *  柱状图
 */
import { UpdatePayload } from '../core/DataSource'
import Band from '../scale/Band'
import AbstractChart from '../super/AbstractChart'

type CandleChartEvents = ''

class Candle extends AbstractChart<CandleChartEvents> implements AbstractChart<CandleChartEvents> {
  getElement (): HTMLElement {
    return this.canvas
  }

  private drawBar (bar: Bar, ctx: CanvasRenderingContext2D) {
    const isRaise = bar.open < bar.close
    const color = isRaise ? 'green' : 'red'
    const top = this.yAxis.value(isRaise ? bar.close : bar.open)
    const bottom = this.yAxis.value(isRaise ? bar.open : bar.close)
    const height = Math.abs(top - bottom)
    const width = (this.xAxis as unknown as Band).bandWidth()
    const x = this.xAxis.value(bar.date)

    ctx.save()
    ctx.strokeStyle = color
    ctx.moveTo(x + width / 2, this.yAxis.value(bar.low))
    ctx.lineTo(x + width / 2, this.yAxis.value(bar.high))
    ctx.fillStyle = color
    ctx.fillRect(x, top, width, height)
    ctx.restore()
  }

  paint (update: UpdatePayload): this {
    const ctx = this.context
    ctx.save()

    for (let i = 0, l = update.bars.length; i < l; i++) {
      const bar = update.bars[i]
      this.drawBar(bar, ctx)
    }

    ctx.stroke()
    ctx.restore()

    return this
  }
}

export default Candle
