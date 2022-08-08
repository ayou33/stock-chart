/**
 *  Event.ts of project stock-chart
 *  @date 2022/7/28 13:57
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { useEvent } from 'lunzi'

class Event<T extends string = string> {
  private readonly _emitter: ReturnType<typeof useEvent>

  constructor () {
    this._emitter = useEvent()
  }

  on (type: T, ...rest: RestParams<typeof this._emitter.on>) {
    this._emitter.on(type, ...rest)

    return this
  }

  once (type: T, ...rest: RestParams<typeof this._emitter.once>) {
    this._emitter.once(type, ...rest)

    return this
  }

  off (type: T, ...rest: RestParams<typeof this._emitter.off>) {
    this._emitter.off(type, ...rest)

    return this
  }

  emit (type: T, ...rest: RestParams<typeof this._emitter.emit>) {
    this._emitter.emit(type, ...rest)

    return this
  }
}

export default Event
