/**
 *  drawLabel.ts of project stock-chart
 *  @date 2022/8/18 14:38
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { LabelStyle } from '../options'
import { WHITE } from '../theme'
import { background } from './typo'

export function drawSeriesLabel (ctx: CanvasRenderingContext2D, y: number, text: string, style: LabelStyle) {
  ctx.fillStyle = style.background ?? style.color
  background(ctx, text, 0, y, style.padding)

  ctx.fillStyle = style.background ? style.color : WHITE
  ctx.fillText(text, 0, y)
}
