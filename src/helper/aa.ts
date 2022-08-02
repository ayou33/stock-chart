/**
 *  aa.ts of project stock-chart
 *  @date 2022/8/2 19:01
 *  @author 阿佑[ayooooo@petalmail.com]
 */
const aa = (context: CanvasRenderingContext2D, width: number, height: number) => {
  const devicePixelRatio = window.devicePixelRatio || 2
  const canvas = context.canvas
  const w = width ?? canvas.width
  const h = height ?? canvas.height

  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  canvas.width = w * devicePixelRatio
  canvas.height = h * devicePixelRatio

  context.scale(devicePixelRatio, devicePixelRatio)
}

export default aa
