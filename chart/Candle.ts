/**
 *  Candle.ts of project stock-chart
 *  @date 2022/7/25 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 *  柱状图
 */
import { UpdatePayload } from '../core/DataSource'
import { RenderOptions } from '../options'
import AbstractChart from '../super/AbstractChart'

class Candle extends AbstractChart implements AbstractChart {
  valueAlign = 0

  constructor (options: RenderOptions) {
    super(options, 'candle')
  }

  private drawBar (ctx: CanvasRenderingContext2D, bar: Bar, width: number) {
    const isRaise = bar.open <= bar.close
    const color = isRaise ? '#00B167' : '#F24A3A'
    const top = this.fy(isRaise ? bar.close : bar.open)
    const bottom = this.fy(isRaise ? bar.open : bar.close)
    const height = Math.max(Math.abs(top - bottom), 1)
    const x = this.fx(bar.date)
    const halfWidth = width / 2

    ctx.beginPath()

    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.fillRect(x, top, width, height)
    ctx.moveTo(x + halfWidth, this.fy(bar.low))
    ctx.lineTo(x + halfWidth, this.fy(bar.high))

    ctx.stroke()
  }

  drawAll (update: UpdatePayload): this {
    const ctx = this.context
    const width = this.xAxis.bandWidth()

    for (let i = 0, l = update.bars.length; i < l; i++) {
      this.drawBar(ctx, update.bars[i], width)
    }

    return this
  }

  drawLatest (update: UpdatePayload): this {
    if (update.latest) {
      this.drawBar(this.context, update.latest, this.xAxis.bandWidth())
    }

    return this
  }
}

export default Candle
