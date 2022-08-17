/**
 *  Candle.ts of project stock-chart
 *  @date 2022/7/25 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 *  柱状图
 */
import { UpdatePayload } from '../core/DataSource'
import AbstractChart from '../super/AbstractChart'

type CandleChartEvents = ''

class Candle extends AbstractChart<CandleChartEvents> implements AbstractChart<CandleChartEvents> {
  getElement (): HTMLElement {
    return this.canvas
  }

  private drawBar (bar: Bar, ctx: CanvasRenderingContext2D) {
    const isRaise = bar.open <= bar.close
    const color = isRaise ? '#00B167' : '#F24A3A'
    const top = this.yAxis.value(isRaise ? bar.close : bar.open)
    const bottom = this.yAxis.value(isRaise ? bar.open : bar.close)
    const height = Math.max(Math.abs(top - bottom), 1)
    const width = this.xAxis.bandWidth()
    const x = this.xAxis.value(bar.date)

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.moveTo(x, this.yAxis.value(bar.low))
    ctx.lineTo(x, this.yAxis.value(bar.high))
    ctx.fillRect(x - width / 2, top, width, height)
    ctx.stroke()
  }

  drawAll (update: UpdatePayload): this {
    const ctx = this.context

    this.clear()

    for (let i = 0, l = update.bars.length; i < l; i++) {
      const bar = update.bars[i]
      this.drawBar(bar, ctx)
    }

    return this
  }

  clearLatest (bar: Bar) {
    const bandWidth = this.xAxis.bandWidth()
    const x = this.xAxis.value(bar.date) - bandWidth / 2
    this.context.clearRect(x - 0.5, 0, bandWidth + 0.5, this.container.height)
  }

  drawLatest (update: UpdatePayload): this {
    if (update.latest) {
      this.clearLatest(update.latest)

      this.drawBar(update.latest, this.context)
    }

    return this
  }
}

export default Candle
