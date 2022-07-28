/**
 *  Event.ts of project stock-chart
 *  @date 2022/7/28 13:57
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { useEvent } from 'lunzi'

class Event <T extends string = string> {
  private readonly emitter: ReturnType<typeof useEvent>

  constructor () {
    this.emitter = useEvent()
  }

  on (type: T, ...rest: Rest<Parameters<typeof this.emitter.on>>) {
    this.emitter.on(type, ...rest)
  }

  once (type: T, ...rest: Rest<Parameters<typeof this.emitter.once>>) {
    this.emitter.once(type, ...rest)
  }

  off (type: T, ...rest: Rest<Parameters<typeof this.emitter.off>>) {
    this.emitter.off(type, ...rest)
  }

  emit (type: T, ...rest: Rest<Parameters<typeof this.emitter.emit>>) {
    this.emitter.emit(type, ...rest)
  }
}

export default Event
