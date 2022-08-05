/**
 *  Event.ts of project stock-chart
 *  @date 2022/7/28 13:57
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { useEvent } from 'lunzi'

class Event<T extends string = string> {
  private readonly emitter: ReturnType<typeof useEvent>

  constructor () {
    this.emitter = useEvent()
  }

  on (type: T, ...rest: RestParams<typeof this.emitter.on>) {
    this.emitter.on(type, ...rest)

    return this
  }

  once (type: T, ...rest: RestParams<typeof this.emitter.once>) {
    this.emitter.once(type, ...rest)

    return this
  }

  off (type: T, ...rest: RestParams<typeof this.emitter.off>) {
    this.emitter.off(type, ...rest)

    return this
  }

  emit (type: T, ...rest: RestParams<typeof this.emitter.emit>) {
    this.emitter.emit(type, ...rest)

    return this
  }
}

export default Event
