/**
 *  aa.ts of project stock-chart
 *  @date 2022/8/2 19:01
 *  @author 阿佑[ayooooo@petalmail.com]
 */

const devicePixelRatio = window.devicePixelRatio || 2

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

export const toAntiAAPointer = ([x, y]: Vector): Vector => [x * devicePixelRatio, y * devicePixelRatio]

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
