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

export function measureText (ctx: CanvasRenderingContext2D, text: string) {
  const measure = ctx.measureText(text)
  const width = measure.width
  const height = ctx.measureText('W').width * (1 + 1 / 6)
  const baseline = ctx.textBaseline
  const align = ctx.textAlign

  const topOffset = baseline === 'middle'
                    ? (-height / 2 - 0.5)
                    : (
                      baseline === 'top'
                      ? 0
                      : -height
                    ) - 0.5

  const leftOffset = align === 'center'
                     ? (-width / 2)
                     : ((
                          align === 'start' ||
                          align === 'left'
                        )
                        ? 0
                        : -width
                     )

  return {
    topOffset,
    leftOffset,
    width,
    height,
  }
}

export function background (
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number, padding: BoxPadding = 0) {
  const { topOffset, leftOffset, width, height } = measureText(ctx, text)
  const { top, right, bottom, left } = expandPadding(padding)
  const X = x + leftOffset
  const Y = y + topOffset
  const w = left + right + width
  const h = top + bottom + height

  ctx.fillRect(X - left, Y - top, w, h)
}
