/**
 *  Gesture.ts of project stock-chart
 *  @date 2022/8/3 15:08
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import nanie from 'nanie'
import { RendererOptions } from '../options'
import AbstractChart from '../super/AbstractChart'

export type GestureEvents = 'transform'

class Gesture<T extends string = any> extends AbstractChart<GestureEvents | T> implements AbstractChart<GestureEvents | T> {

  constructor (options: RendererOptions) {
    super(options)

    options.container.node.style.position = 'relative'

    this.canvas.style.cssText += `
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    `
    this.canvas.addEventListener('mousemove', () => {
      // this.xAxis.transform()
      // this.yAxis.transform()
      // // this.drawCrosshair()
      // this.emit('transform')
    })

    nanie(this.canvas, e => {
      this.xAxis.transform(e.transform)
      this.yAxis.transform(e.transform)
      this.emit('transform')
    })

    this.autoStroke = true
  }

  paint () {
    return this
  }

  getElement (): HTMLElement {
    return this.canvas
  }
}

export default Gesture
