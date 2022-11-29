/**
 *  @file         stock-chart/super/DrawingStateManager.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/11/28 19:26
 *  @description
 */
export enum State {
  PENDING,
  READY, // 一般状态
  CANCELED,
  ACTIVE, // hovered
  FOCUSED, // hover & click
  BUSY, // 忙，包括正在绘制，正在删除等不可操作状态
}

export function createStateChine () {
  let state = State.PENDING
  let savedState: State | null = null

  const transform = (to: State, from?: Array<State>) => {
    return (force = false) => {
      if (force || (from?.indexOf(state) ?? 0) !== -1) {
        state = to
        return true
      }

      return false
    }
  }

  class Manager {
    ready = transform(State.READY, [State.PENDING, State.FOCUSED, State.ACTIVE])

    reset = this.ready

    cancel = transform(State.CANCELED, [State.PENDING])

    busy = transform(State.BUSY, [State.ACTIVE])

    active = transform(State.ACTIVE, [State.READY])

    focus = transform(State.FOCUSED, [State.ACTIVE])

    save () {
      savedState = state
    }

    restore () {
      if (savedState) {
        state = savedState
        savedState = null
      }
    }

    isReady () {
      return state === State.READY
    }

    isPending () {
      return state === State.PENDING
    }

    isBusy () {
      return state === State.BUSY
    }

    isActive () {
      return state === State.ACTIVE
    }

    isFocused () {
      return state === State.FOCUSED
    }
  }

  return new Manager()
}

export type StateMachine = ReturnType<typeof createStateChine>

export default createStateChine
