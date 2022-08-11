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

    nanie(this.canvas, (e) => {
      if (e.type === 'zoom') {
        const event = e.sourceEvent as MouseEvent
        this.pointer(event.clientX, event.clientY)
        // console.log(this.pointer(event.clientX, event.clientY))
        this.xAxis.transform(e.transform)
        this.yAxis.transform(e.transform)
        this.emit('transform')
      }
    })

    this.autoStroke = true
  }

  paint () {
    return this
  }
}

export default Gesture
