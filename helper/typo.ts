/**
 *  typo.ts of project stock-chart
 *  @date 2022/8/15 16:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { BoxPadding } from '../options'
import { expandPadding } from './format'

export function fontSize (size: number) {
  return `${size}px sans-serif`
}

export function defaultFontSize () {
  return fontSize(10)
}

export function background (
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number, padding: BoxPadding = 0) {
  const measure = ctx.measureText(text)
  const p = expandPadding(padding)
  const height = ctx.measureText('M').width * (1 + 1 / 8)

  ctx.fillRect(
    x - measure.actualBoundingBoxLeft - p.left,
    y - p.top - (ctx.textBaseline === 'middle' ? height / 2 : (ctx.textBaseline === 'top' ? 0 : height)),
    measure.width + p.left + p.right,
    height + p.top + p.bottom,
  )
}
