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
    throw new ReferenceError('At least one point is required!')
  } else if (points.length === 1) {
    ctx.beginPath()
    ctx.arc(points[0].x, points[0].y, padding, 0, 2 * Math.PI)
  } else if (points.length === 2) {
    const p1 = points[0]
    const p2 = points[1]
    const a = Math.abs(p1.x - p2.x)
    const b = Math.abs(p1.y - p2.y)
    const len = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) + (2 * padding) // 线段长度
    const c1 = Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180 / Math.PI
    // const c2 = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
    
    const renge = c1

    // const { x, y } = Math.abs(c1) > Math.abs(c2) ? p1 : p2
    const { x, y } = p2

    ctx.save()
    ctx.beginPath()
    ctx.translate(x, y)
    ctx.rotate(renge * Math.PI / 180)
    ctx.rect(-padding, -padding, len, 2 * padding)
    ctx.restore()
  } else {
    // 多边形描边 需要使用 ctx.isPointInStroke 判断
    ctx.save()
    ctx.lineWidth = padding * 2
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for(let i = 1; i < points.length; i++){
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.lineTo(points[0].x, points[0].y)
    ctx.restore()
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
