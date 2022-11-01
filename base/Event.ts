/**
 *  Event.ts of project stock-chart
 *  @date 2022/7/28 13:57
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { useEvent } from 'lunzi'

type Emitter = ReturnType<typeof useEvent>

class Event<T extends string = string, U extends string = T | `${T}${string} ${T}${string}`> {
  private readonly _emitter: Emitter

  constructor () {
    this._emitter = useEvent()
  }

  on (type: U, ...rest: RestParams<Emitter['on']>) {
    this._emitter.on(type, ...rest)

    return this
  }

  once (type: U, ...rest: RestParams<Emitter['once']>) {
    this._emitter.once(type, ...rest)

    return this
  }

  off (type: U | '*', ...rest: RestParams<Emitter['off']>) {
    this._emitter.off(type, ...rest)

    return this
  }

  emit (type: U, ...rest: RestParams<Emitter['emit']>) {
    this._emitter.emit(type, ...rest)

    return this
  }
}

export default Event
