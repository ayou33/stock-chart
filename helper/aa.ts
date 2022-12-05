/**
 *  aa.ts of project stock-chart
 *  @date 2022/8/2 19:01
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { measureText } from './typo'

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
    const doublePadding = padding * 2
    ctx.beginPath()
    ctx.rect(point.x, Y - doublePadding, width + doublePadding, height + doublePadding)
  }
}

/**
 * 根据坐标点个数描边
 * @param ctx 
 * @param points 一个点画圈  两个点画线段  三个以上为多边形(多边形需要按照描边顺序传入坐标点)
 * @param padding 设置描边间距
 * @returns 
 */
export const createPointsOutline = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  padding: number = 1,
) => {
  if (points.length === 0) {
    return
  } else if (points.length === 1) {
    ctx.beginPath()
    ctx.arc(points[0].x, points[0].y, padding, 0, 2 * Math.PI)
  } else if (points.length === 2) {
    ctx.lineWidth = padding * 2
    ctx.lineCap = "square"
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    ctx.lineTo(points[1].x, points[1].y)
  } else {
    ctx.lineWidth = padding * 2
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for(let i = 1; i < points.length; i++){
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.lineTo(points[0].x, points[0].y)
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
