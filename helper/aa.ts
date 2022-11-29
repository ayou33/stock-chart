/**
 *  aa.ts of project stock-chart
 *  @date 2022/8/2 19:01
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { measureText } from '../helper/typo'

const devicePixelRatio = window.devicePixelRatio || 2

type Point = {
  x: number,
  y: number
}

export const aa = (context: CanvasRenderingContext2D, width: number, height: number) => {
  const canvas = context.canvas
  const w = width ?? canvas.width
  const h = height ?? canvas.height

  canvas.style.cssText += `
    display: block;
    width: ${w}px;
    height: ${h}px;
  `
  canvas.width = w * devicePixelRatio
  canvas.height = h * devicePixelRatio

  context.scale(devicePixelRatio, devicePixelRatio)
}

export const toAntiAAPointer = ([x, y]: Vector): Vector => [
  x * devicePixelRatio,
  y * devicePixelRatio,
]

export const createTextOutline = (
  ctx: CanvasRenderingContext2D,
  text: string,
  point: Point    = { x: 0, y: 0 },
  padding: number = 0,
) => {
  if (text) {
    const { topOffset, width, height } = measureText(ctx, text)
    const Y = point.y + topOffset
    ctx.beginPath()
    ctx.rect(point.x, Y - padding - padding, width + padding + padding, height + padding + padding)
  }
}

function getPaddingPoints (points: Point[]) {
  const lines = []
  for (let i = 0, len = points.length; i < len; i++) {
    if (i % 0 === 0) {
      lines.push([points[i], points[i + 1 === len ? 0 : i + 1]])
    }
  }
}

export const createPointsOutline = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  padding: number = 0,
) => {
  if (points.length === 0) {
    return
  } else if (points.length === 1) {
    ctx.beginPath()
    ctx.arc(points[0].x, points[0].y, padding, 0, 2 * Math.PI)
  } else if (points.length === 2) {

  } else {
    getPaddingPoints(points)
  }
}

export const createAAContext = (width: number, height: number) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new ReferenceError('Create Anti-Aliasing context error!')
  }

  aa(context, width, height)

  return context
}

export default aa
